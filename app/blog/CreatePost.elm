port module CreatePost exposing (main)

import Control exposing (Control)
import Control.Debounce as Debounce
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Markdown
import Time


type Msg
    = SetTitle String
    | SetContentMarkdown String
    | SetContentFocusMark String
    | SetGithubToken String
    | Deb (Control Msg)


type alias Model =
    { title : String
    , contentMarkdown : String
    , contentFocusMark : String
    , contentState : Control.State Msg
    , githubToken : String
    }


port focusMarkOut : String -> Cmd msg


port focusMarkIn : (String -> msg) -> Sub msg


debounce : Msg -> Msg
debounce =
    Debounce.trailing Deb (1.25 * Time.second)


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        SetTitle newTitle ->
            ( { model | title = newTitle }, Cmd.none )

        SetGithubToken token ->
            ( { model | githubToken = token }, Cmd.none )

        SetContentFocusMark content ->
            ( { model
                | contentFocusMark = content
              }
            , focusMarkOut content
            )

        SetContentMarkdown content ->
            ( { model
                | contentMarkdown = content
              }
            , Cmd.none
            )

        Deb debMsg ->
            Control.update (\state -> { model | contentState = state }) model.contentState debMsg


subscriptions : Model -> Sub Msg
subscriptions model =
    focusMarkIn (\result -> SetContentMarkdown result)


view : Model -> Html Msg
view model =
    div [ class "create-post" ]
        [ h2 [] [ text model.title ]
        , section [ class "preview" ] [ (Markdown.toHtml [] model.contentMarkdown) ]
        , hr [] []
        , label [ for "title" ] [ text "title" ]
        , input [ name "title", value model.title, size 35, onInput SetTitle ] []
        , textarea
            [ class "content"
            , cols 80
            , rows 15
            , Html.Attributes.map debounce <| onInput SetContentFocusMark
            ]
            []
        , label [ for "github-token" ] [ text "github token" ]
        , input [ type_ "password", name "github-token", size 35, value model.githubToken, onInput SetGithubToken ] []
        , button [ disabled True ] [ text "Save" ]
        ]


init : ( Model, Cmd Msg )
init =
    ( { title = "new-post-title-here"
      , contentMarkdown = ""
      , contentFocusMark = "write some **markdown** here"
      , contentState = Control.initialState
      , githubToken = ""
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
