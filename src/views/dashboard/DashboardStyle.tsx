import { Theme } from "@mui/material/styles";
import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    boxContainer: {
      borderRadius: "10px",
      backgroundColor: "#fff",
      width: "100%",
      height: "180px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
    boxSubContainer: {
      borderRadius: "10px",
      backgroundColor: "#fff",
      width: "90%",
      height: "180px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
    boxSubParcel: {
      borderRadius: "10px",
      backgroundColor: "#fff",
      width: "90%",
      height: "40px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
    boxManagerContainer: {
      borderRadius: "10px",
      backgroundColor: "#fff",
      width: "100%",
      height: "180px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
    boxSubManager: {
      borderRadius: "10px",
      backgroundColor: "#FFDAB9",
      width: "90%",
      height: "40px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
    boxSubStaff: {
      borderRadius: "10px",
      backgroundColor: "#AFEEEE",
      width: "90%",
      height: "40px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
    boxSubRepair: {
      borderRadius: "10px",
      backgroundColor: "#fff",
      width: "90%",
      height: "180px",
      boxShadow:
        "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12);",
    },
  })
);
