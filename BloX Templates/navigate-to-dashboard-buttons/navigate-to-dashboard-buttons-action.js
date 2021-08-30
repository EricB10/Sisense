// Holds the chosen granularity from the selected button 'months' for example
const dategran = payload.dategran;
var widgetIds = payload.data.widgetToModify;

//Change the background color for unselected buttons
payload.widget.style.currentCard.actions.forEach(function (i) {
    i.style["background-color"] = '#ffffff'
})

//Change the border color for unselected buttons
payload.widget.style.currentCard.actions.forEach(function (i) {
    i.style["border"] = [
        "4px",
        "solid",
        "#211551"
        ]
})

//Change the background color for selected buttons
payload.widget.style.currentCard.actions
    .filter(i => i.dategran == dategran)[0].style["background-color"] = "#eeeeee"

//Change the border color for selected buttons
payload.widget.style.currentCard.actions
    .filter(i => i.dategran == dategran)[0].style["border"] = [
        "4px",
        "solid",
        "#d6001c"
        ]   

//Redraw the changes
payload.widget.redraw()

//For each widget change the data granularity
payload.widget.dashboard.widgets.$$widgets
    .filter(i => widgetIds.includes(i.oid))
    .forEach(function (widget) {
        //change the level of granularity to the chosen value from our button: 'months' for example
        widget.metadata.panels[0].items[0].jaql.level = dategran;
        //Apply changes to Mongo
        widget.changesMade()
        //Refresh widget
        widget.refresh()
    })