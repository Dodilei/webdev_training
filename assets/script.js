function ColorChoose(button) {
    ResetChoice(document.getElementsByClassName("colorchoice"));
    const b = document.getElementById(button);
    b.style.border = "0.1rem solid whitesmoke";
    b.style.padding = "0.2rem";
    const c = document.getElementById('activecolor');
    c.style.backgroundColor = window.getComputedStyle(b).backgroundColor;
}

function ResetChoice(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.border = "0.3rem solid gainsboro";
        buttons[i].style.padding = "0px";
    }
}

function Counter(increment) {
    const label = document.getElementById("counterlabel");
    const count = parseInt(label.innerHTML);
    const future = count+increment;
    if (future >= 0 && future <= 10) {
        label.innerHTML = future;
    } else {
        label.innerHTML = count;
    }
}

function DisplayChosenDate() {
    for (let i = 1; i <= 6; i++) {
        let value = document.getElementById("dti" + i.toString()).value;
        document.getElementById('cdl'+i).innerHTML = value;
    }
}

function DateInputSet(element) {

    let max = Infinity;
    if (element.max) {
        max = element.max;
    }
    const min = element.min;
    let value = element.value ? parseInt(element.value) : -1;

    if (value > max) {
        value = max;
    } else if (value < min) {
        value = min;
    }
    
    element.value = value;

    if (element.name === 'month') {
        MonthMaxDays(value, parseInt(document.getElementById('dti1').value));
    } else if (element.name === 'year') {
        MonthMaxDays(parseInt(document.getElementById('dti2')), value);
    }

}

function MonthMaxDays(month, year) {

    days = document.getElementById('dti3');

    if (month === 2) {
        if (year % 4 === 0) {
            days.max = 29;
        } else {
            days.max = 28;
        }
    } else if (month <= 7) {
        if (month % 2 === 0) {
            days.max = 30;
        } else {
            days.max = 31;
        }
    } else {
        if (month % 2 === 0) {
            days.max = 31;
        } else {
            days.max = 30;
        }
    }

    DateInputSet(days);
}

function SendToCountdown() {

    const count_id_container = document.getElementById('data1');

    if (count_id_container.innerHTML) {
        clearInterval(count_id_container.innerHTML);
    }
    
    let date_array = [];

    for (let i = 1; i <= 6; i++) {
        let value = parseInt(document.getElementById("dti" + i.toString()).value);
        date_array[i-1] = value;
    }

    date_array[1] -= 1;

    const dateTo = new Date(...date_array);

    const countdown = setInterval(
        function() {
            const now = new Date().getTime();

            let dif = dateTo - now;

            const years = Math.floor(dif / (1000*60*60*24*365));
            dif -= years*(1000*60*60*24*365);
            const months = Math.floor(dif / (1000*60*60*24*30));
            dif -= months*(1000*60*60*24*30);
            const days = Math.floor(dif / (1000*60*60*24));
            dif -= days*(1000*60*60*24);
            const hours = Math.floor(dif / (1000*60*60));
            dif -= hours*(1000*60*60);
            const minutes = Math.floor(dif / (1000*60));
            dif -= minutes*(1000*60);
            const seconds = Math.floor(dif / 1000);

            const remaining_array = [years, months, days, hours, minutes, seconds];

            for (let i = 1; i <= 6; i++) {
                let value = remaining_array[i-1];
                document.getElementById('ctdl'+i).innerHTML = value;
            }
        },
        1000
    );

    count_id_container.innerHTML = countdown;
}

function SetTrigger(id, func, key) {
    ele = document.getElementById(id);
    const event_func = function(
                    event,
                    element = ele
                    ) {

        if (event.key === key) {
            func(element);
        }
    };

    ele.addEventListener("keydown", event_func);
}

function ResetInput(element) {
    
    element.style.color = '#5f5f5f';
    element.value = 'Write a new task';
}

function SetTask(element) {
    if (element.value === '') {
        element.blur();
    }
    else {
        AddTask(element.value);
        element.value = '';
    }
}

function AddTask(task) {
    const parent_div = document.getElementById('tasks_container');

    const new_task_container = document.createElement('div');

    const tasknum = parseInt(parent_div.getAttribute('data-tasknum'));
    new_task_container.id = 'task' + tasknum;
    parent_div.setAttribute('data-tasknum', tasknum+1);

    new_task_container.className = 'task_div';

    const new_task = document.createElement('span');
    new_task.className = 'task_text';

    new_task.innerHTML = task;

    new_task_container.appendChild(new_task);

    new_task_container.setAttribute('data-taskdone', false);

    const button_div = document.createElement('div');
    button_div.style.margin = '0';
    button_div.style.marginLeft = 'auto';
    button_div.style.display = 'flex'
    button_div.style.alignItems = 'center';

    const done_button = document.createElement('button');
    done_button.innerHTML = '&#10004';
    done_button.className = 'task_button';
    done_button.style.color = 'green';
    done_button.id = 'task_button_done';

    done_button.setAttribute('onclick',
    `MarkAsDone(this, '${new_task_container.id}')`);

    const delete_button = document.createElement('button');
    delete_button.innerHTML = '&#10007';
    delete_button.className = 'task_button';
    delete_button.style.color = 'red';
    delete_button.id = 'task_button_delete';

    delete_button.setAttribute('onclick',
    `DeleteTask('${new_task_container.id}')`)

    button_div.appendChild(done_button);
    button_div.appendChild(delete_button);

    new_task_container.appendChild(button_div);
    parent_div.appendChild(new_task_container);
}

function MarkAsDone(button, task_id) {
    const task_container = document.getElementById(task_id);
    if (task_container.getAttribute('data-taskdone') === 'false') {
        task_container.children[0].style.textDecorationLine = 'line-through';
        task_container.setAttribute('data-taskdone', 'true')

        button.innerHTML = '&#8635';
        button.style.color = 'blue';

    } else {
        task_container.children[0].style.textDecorationLine = 'none';
        task_container.setAttribute('data-taskdone', 'false')

        button.innerHTML = '&#10004';
        button.style.color = 'green';
    }
}

function DeleteTask(task_id) {
    const task_container = document.getElementById(task_id);
    task_container.parentNode.removeChild(task_container);
}

function LostFocus(element) {
    if (element.value === '') {
        element.blur();
        ResetInput(element);
    }
}