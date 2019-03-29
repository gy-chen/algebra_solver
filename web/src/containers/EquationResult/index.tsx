import { connect } from "react-redux";
import { RootState } from "../../store/types";
import EquationResult from "../../components/EquationResult";

const mapStateToProps = (state: RootState) => {
  return {
    task: state.task.currentTask,
    lossThreshold: process.env.REACT_APP_LOSSTHRESHOLD
      ? Number.parseFloat(process.env.REACT_APP_LOSSTHRESHOLD)
      : null
  };
};

export default connect(mapStateToProps)(EquationResult);
