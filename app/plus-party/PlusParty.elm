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
    | CopyTotal Bool


type alias Model =
    { text : String
    , copying : Bool
    }


type alias Party =
    { numbers : List String
    , totalFixed : String
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
        { numbers = List.map toString numbers
        , totalFixed = fix2 total
        }


item : String -> Html msg
item fixed =
    li [] [ text fixed ]


later : msg -> Cmd msg
later msg =
    (Time.second * 2) |> Process.sleep |> Task.perform (\_ -> msg)



-- http://stackoverflow.com/a/41495885/266795


buttonText : Bool -> JE.Value
buttonText copying =
    case copying of
        True ->
            JE.string "Copied!"

        False ->
            JE.string "Copy Total &#x1F4CB;"


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        ChangeInput newText ->
            ( { model | text = newText }, Cmd.none )

        CopyTotal state ->
            ( { model | copying = state }
            , case state of
                True ->
                    later (CopyTotal False)

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
            , button
                [ id "copy-total"
                , onClick (CopyTotal True)
                , attribute "data-clipboard-text" party.totalFixed
                , property "innerHTML" (buttonText model.copying)
                ]
                []
            , ul [ class "clear" ] (List.map item party.numbers)
            , div [ class "total" ]
                [ text party.totalFixed
                ]
            ]


init : ( Model, Cmd Msg )
init =
    ( { text = initialText, copying = False }
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
