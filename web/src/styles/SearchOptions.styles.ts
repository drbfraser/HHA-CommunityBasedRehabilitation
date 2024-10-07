import makeStyles from '@mui/styles/makeStyles';

export const useSearchOptionsStyles = makeStyles(
    {
        searchOptions: {
            verticalAlign: "top",
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
