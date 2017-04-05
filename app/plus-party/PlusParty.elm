port module PlusParty exposing (main)

import Core
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Process
import Task
import Time
import Round


type Msg
    = ChangeInput String
    | CopyFixed
    | CopyFixedDone
    | CopyFloat
    | CopyFloatDone


type alias Model =
    { text : String
    , numbers : List Float
    , total : Float
    , copyingFloat : Bool
    , copyingFixed : Bool
    }


type alias Party =
    { numbersFixed : List String
    , total : String
    , totalFixed : String
    }


initialText : String
initialText =
    """Paste some numbers in here and we'll total them up even if there's some words and junk, too.

For example: 1 plus 2 plus 2 plus 1
"""


getParty : String -> Party
getParty text =
    let
        fix2 =
            Round.round 2

        numbers =
            Core.parseNumbers text

        total =
            List.sum numbers
    in
        { numbersFixed = List.map fix2 numbers
        , total = toString total
        , totalFixed = (fix2 total)
        }


item : String -> Html msg
item fixed =
    li [] [ text fixed ]


later : msg -> Cmd msg
later msg =
    (Time.second * 2) |> Process.sleep |> Task.perform (always msg)

totalView : String -> String -> Bool -> msg -> Html msg
totalView value selector copying msg =
    div [ class "total" ]
        [ button
            [ id selector
            , onClick msg
            , attribute "data-clipboard-text" value
            ]
            [ text (buttonText copying)
            ]
        , text value
        ]
buttonText : Bool -> String
buttonText copying =
    if copying then
        "Copied!"
    else
        "Copy to clipboard"


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        ChangeInput newText ->
            let
                numbers =
                    Core.parseNumbers newText
            in
                Debug.log ":" ( { model | text = newText, numbers = numbers, total = List.sum numbers }, Cmd.none )

        CopyFixed ->
            ( { model | copyingFixed = True }
            , later CopyFixedDone
            )

        CopyFixedDone ->
            ( { model | copyingFixed = False }, Cmd.none )

        CopyFloat ->
            ( { model | copyingFloat = True }
            , later CopyFloatDone
            )

        CopyFloatDone ->
            ( { model | copyingFloat = False }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    let
        party =
            getParty model.text
    in
        div [ class "plus-party" ]
            [ textarea [ onInput ChangeInput ] [ text model.text ]
            , ul [ class "clear" ] (List.map item party.numbersFixed)
            , totalView party.totalFixed "copy-fixed" model.copyingFixed CopyFixed
            , totalView party.total "copy-float" model.copyingFloat CopyFloat
            ]


init : ( Model, Cmd Msg )
init =
    ( { text = initialText
      , numbers = []
      , total = 0
      , copyingFloat = False
      , copyingFixed = False
      }
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
