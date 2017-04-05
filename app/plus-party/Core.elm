module Core exposing (parseNumbers)

import String
import Regex exposing (regex)


commaRe : Regex.Regex
commaRe =
    regex ","


dateRe : Regex.Regex
dateRe =
    regex "\\b\\d{1,2}\\/\\d{1,2}\\/(\\d{2}|\\d{4})\\b"


numberRe : Regex.Regex
numberRe =
    regex "-?(\\d{1,3}(,\\d{3})*|\\d+)(\\.\\d+)?\\b"


parseFloat : Regex.Match -> Maybe Float
parseFloat match =
    Result.toMaybe (String.toFloat match.match)


parseNumbers : String -> List Float
parseNumbers rawText =
    let
        noDates =
            Regex.replace Regex.All dateRe (always "") rawText
    in
        Regex.find Regex.All numberRe noDates
            |> List.filterMap parseFloat
