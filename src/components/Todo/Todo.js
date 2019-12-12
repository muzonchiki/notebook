import React, { PureComponent } from 'react';
import Card from '../Card';
import './Todo.css';
import withLocalStorage from '../../HOCs/withLocalStorage';

class Todo extends PureComponent {
    state = {
        inputValue: '',
    };

    getId() {
        const { savedData } = this.props;
        const biggest = savedData.reduce((acc, el) => Math.max(acc, el.id), 0);
        return biggest + 1;
    };

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
    };

    createNewRecordByEnter = (e) => {
        if(e.key === 'Enter') this.createNewRecord();
    };

    createNewRecord = () => {
        const { inputValue } = this.state;
        const { savedData, saveData } = this.props;

        if(inputValue) {
            saveData([
                {
                    id: this.getId(),
                    value: inputValue,
                    isComplete: false,
                },
                ...savedData
            ]);
            this.setState({inputValue: ''});
        }
    };

    toggleRecordComplete = (e) => {
        const { savedData, saveData } = this.props;
        const dataId = parseInt(e.target.dataset.todoId, 10);
        const newData = savedData.map(dataItem => {
            return dataItem.id === dataId
                ? { ...dataItem, isComplete: !dataItem.isComplete }
                : dataItem;
        });

        saveData(newData);
    };

    render() {
        return (
            <Card title='Список дел'>
                <div className='todo'>
                    {this.renderEmptyRecord()}
                    {this.renderRecord()}
                </div>
            </Card>
        )
    };

    renderEmptyRecord() {
        const { inputValue } = this.state;

        return (
            <div className='todo-item todo-item-new'>
                <input className='todo-input' 
                    placeholder='Выберите задачу' 
                    value={ inputValue }
                    onChange={this.handleChange}
                    onKeyDown={this.createNewRecordByEnter} 
                />
                <span className='plus' onClick={this.createNewRecord}>+</span>
        </div>
        );
    }

    renderRecord() {
        const { savedData } = this.props;

        return(
            savedData.map(item => (
                <div className='todo-item' key={item.id}>
                    <p className='todo-item__text'>{item.value}</p>
                    <span 
                        className='todo-item__flag'
                        data-todo-id={item.id}
                        onClick={this.toggleRecordComplete}
                    >
                        [{item.isComplete ? 'x' : ''}]
                    </span>
                </div>
            ))
        )
    };
}

export default withLocalStorage('todo-app', [])(Todo);