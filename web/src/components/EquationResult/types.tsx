import { Task } from '../../store/task/types';

export interface EquationResultProps {
    task?: Task | null,
    lossThreshold?: number | null
}