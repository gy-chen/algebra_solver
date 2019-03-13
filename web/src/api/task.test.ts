import * as taskApi from './task';

it('createTask', done => {
    const expectContent = 'x - 1 = 0';

    taskApi.createTask(expectContent)
        .then(res => {
            const task = res.data.task;
            expect(task.id).toBeDefined();
            expect(task.state).toBeDefined();
            expect(task.result).toBeDefined();
            expect(task.content).toEqual(expectContent);
            done();
        });
});

it('pollTask', async done => {
    const expectContent = 'x - 1 = 0';
    const res = await taskApi.createTask(expectContent);
    const taskId = res.data.id;

    taskApi.pollTask(taskId.id)
        .subscribe(task => {
            expect(task.id).toBeDefined();
            expect(task.state).toBeDefined();
            expect(task.result).toBeDefined();
            expect(task.content).toEqual(expectContent);
            done();
        });
});