port module PlusParty exposing (main)

import Core
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import ToFixed exposing (toFixed)

type Msg
    = ChangeInput String
    | CopyToClipboard


type alias Model =
    { text : String
    , numbers : List Float
    , total : Float
    }

update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        ChangeInput newText ->
            let
                numbers =
                    Core.parseNumbers newText
            in
                Debug.log ":" ( { model | text = newText, numbers = numbers, total = List.sum numbers }, Cmd.none )

        CopyToClipboard ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div [ class "plus-party" ]
        [ h1 [] [ text "Plus Party Dev1" ]
        , textarea [ onInput ChangeInput ] [ text "hey" ]
        , button
            [ id "copyToClipboard"
            , onClick CopyToClipboard
            , attribute "data-clipboard-text" (toString model.total)
            ]
            [ text "Copy Total to Clipboard" ]
        , ul [ class "clear" ] (List.map (\n -> li [] [ text (toFixed 2 n) ]) model.numbers)
        , div [ class "total" ] [ text (toString model.total) ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model "" [] 0, Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
