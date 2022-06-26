const socket = io();
var folder, id, file;
var img = $("#image")[0];
var btns = $("#center")[0];
var keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]

document.addEventListener("keyup", function(event) {
    if (keys.includes(Number(event.key)))
    {
        $(".choose")[event.key - 1].click();
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key == 'Enter')
    {
        $('#complete')[0].click();
    }
});

function appendAttrs (elem, attrs) 
{
    const appender = (res, attr) => 
    {
        res.setAttribute(attr[0], attr[1])
        return res
    }
    return Object.entries(attrs).reduce(appender, elem)
}

function createElem (tag, classes = [], children = [], attrs = {}) 
{
    let elem = document.createElement(tag)
    elem.classList = classes
    elem = appendAttrs(elem, attrs)
    return appendChildren(elem, children)
}

function appendChildren (elem, children) 
{
    const appender = (res, child) => 
    {
        res.appendChild(child)
        return res
    }
    return children.reduce(appender, elem)
}

fetch('/public/config.json')
    .then(result => result.json())
    .then((json) => {
        for (let i = 0; i < Object.keys(json.categories).length; i++)
        {
            let newButt = createElem('button', ['choose']);
            newButt.innerText = json.categories[i];
            newButt.id = i + 1;
            newButt.setAttribute('onclick', 'select(this)');
            btns.appendChild(newButt);
        }
})

$( document ).ready(function() {
    socket.emit('start')
})

socket.on('file', function(_file, _id) 
{
    if ((id && id == _id) || !id)
    {
        id = _id;
        file = _file;
        img.src = './public/data/' + file
    }
}) 

socket.on('again', function(_id) 
{
    if ((id && id == _id) || !id)
    {
        socket.emit('start')
    }
}) 

function select(dir)
{
    let buttons = $(".choose");
    folder = dir.innerText;
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].style.border = "transparent solid 2px"
    }
    dir.style.border = "#ff5555 solid 2px"
}

function send()
{
    console.log(folder, file, id)
    socket.emit('complete', folder, file, id)
}

