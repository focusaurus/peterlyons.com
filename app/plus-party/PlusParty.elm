port module PlusParty exposing (main)

import Core
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Process
import Task
import Time
import Round
import Json.Encode as JE

type Msg
    = ChangeInput String
    | CopyFixed Bool
    | CopyFloat Bool


type alias Model =
    { text : String
    , copyingFloat : Bool
    , copyingFixed : Bool
    }


type alias Party =
    { numbersFixed : List String
    , totalFloat : Total
    , totalFixed : Total
    }


type alias Total =
    { selector : String
    , value : String
    , copying : Bool
    }


initialText : String
initialText =
    """Paste some numbers in here and we'll total them up even if there's some words and junk, too.

For example: 1 plus 2 plus 2 plus 1
"""

fix2 : Float -> String
fix2 =
    Round.round 2


getParty : Model -> Party
getParty model =
    let
        numbers =
            Core.parseNumbers model.text

        total =
            List.sum numbers
    in
        { numbersFixed = List.map fix2 numbers
        , totalFloat = Total "copy-float" (toString total) model.copyingFloat
        , totalFixed = Total "copy-fixed" (fix2 total) model.copyingFixed
        }


item : String -> Html msg
item fixed =
    li [] [ text fixed ]


later : msg -> Cmd msg
later msg =
    (Time.second * 2) |> Process.sleep |> Task.perform (\_ -> msg)


totalView : Total -> msg -> Html msg
totalView total msg =
    div [ class "total" ]
        [ button
            [ id total.selector
            , onClick msg
            , attribute "data-clipboard-text" total.value
            , property "innerHTML" (buttonText total.copying)
            ]
            [ ]
        , text total.value
        ]


-- http://stackoverflow.com/a/41495885/266795
buttonText : Bool -> JE.Value
buttonText copying =
    case copying of
        True ->
            JE.string "Copied!"

        False ->
            JE.string "Copy &#x1F4CB;"


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        ChangeInput newText ->
            ( { model | text = newText }, Cmd.none )

        CopyFloat state ->
            ( { model | copyingFloat = state }
            , case state of
                True ->
                    later (CopyFloat False)

                False ->
                    Cmd.none
            )

        CopyFixed state ->
            ( { model | copyingFixed = state }
            , case state of
                True ->
                    later (CopyFixed False)

                False ->
                    Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    let
        party =
            getParty model
    in
        div [ class "plus-party" ]
            [ textarea [ onInput ChangeInput ] [ text model.text ]
            , ul [ class "clear" ] (List.map item party.numbersFixed)
            , totalView party.totalFixed (CopyFixed True)
            , totalView party.totalFloat (CopyFloat True)
            ]


init : ( Model, Cmd Msg )
init =
    ( { text = initialText, copyingFloat = False, copyingFixed = False }
    , Cmd.none
    )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
