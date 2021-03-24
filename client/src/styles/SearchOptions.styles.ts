import { makeStyles } from "@material-ui/core/styles";

export const useSearchOptionsStyles = makeStyles(
    {
        searchOptions: {
            verticalAlign: "top",
            float: "right",
            display: "inline-block",
            paddingRight: 2,
            "& .MuiSelect-root": {
                minWidth: 43,
            },
        },
        zoneOptions: {
            minWidth: 175,
        },
    },
    { index: 1 }
);
