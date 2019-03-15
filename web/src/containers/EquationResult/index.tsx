import { connect } from 'react-redux';
import { RootState } from '../../store/types';
import EquationResult from '../../components/EquationResult';

const mapStateToProps = (state: RootState) => {
    return {
        task: state.task.currentTask
    };
};

export default connect(mapStateToProps)(EquationResult);