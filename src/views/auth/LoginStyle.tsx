import { Theme } from "@mui/material/styles";
import { makeStyles, createStyles, withStyles } from "@mui/styles";

import TextField from "@mui/material/TextField";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    txtColor: {
      color: "#A6A6A6",
    },
    iconMargin: {
      marginRight: "4px",
    },
  })
);

export const TextFieldCustom = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 14,
        "& input": {
          color: "#000",
          fontSize: 16,
        },
        "& .MuiInputAdornment-root": {
          "& .MuiSvgIcon-root": {
            color: "#757575",
            width: 22,
            height: 22,
          },
        },
      },
    },
  })
)(TextField);
