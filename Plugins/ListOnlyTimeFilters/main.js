/*
ListOnlyTimeFilters plugin shows viewers only the List option (no Calendar, Time Frame, etc.) for time dimesion filters and within list viewers would be able to only select the options Year, Quarter, Month
*/

//Registering the plugin
prism.run(["$filter", function ($filter) {

    //Upon the dashboard is loaded adding the addional event listeners to the buttons in the page
    prism.on("dashboardloaded", function (e, args) {
        const $identity = prism.$injector.get('base.services.$identity');
        //Identifying if the current user is customer
        if ($identity.user.roleName == 'consumer') {
            setTimeout(function () {

                //Event listener for Edit filter button
                function maskFilterOptions() {
                    setTimeout(function () {
                        //Selecting the list of filter options available under "Edit Filter" pane
                        let els = document.getElementsByClassName("uc-db-popup")[0].getElementsByClassName("uc-nav")[0].children;
                        //Iterating through each of the options
                        els.forEach(function (item) {
                            if (item.title == "List") {
                                //Stimluating a click on "List" option if it is not selected by default
                                if (!item.classList.contains("selected")) {
                                    item.click();
                                }
                                // Add an additional event listener to the dropdown "List" option to hide the options other than Year, Quarter, Month when clicked
                                setTimeout(function () {
                                    //Select the filter pane
                                    let listFilterPane = document.getElementById('uc-filter');
                                    //Select the dropdown down within filter pane
                                    let listDropArrow = listFilterPane.getElementsByClassName('drop-presenter')[0];
                                    //Removing(to aviod multiple invocation of the same event listener if already registered) and adding the additional event listener
                                    listDropArrow.removeEventListener("click", hideListOptions);
                                    listDropArrow.addEventListener("click", hideListOptions);
                                }, 100)
                            }
                            //Hiding other options
                            else {
                                item.classList.add("ng-hide");
                            }
                        }
                        );
                    }, 100);
                }

                //Event Listener when dropdown is selected
                function hideListOptions() {
                    setTimeout(function () {
                        //Options to show
                        let itemsToShow = ['Years', 'Months', 'Quarters'];
                        //Selecting the filter overlay
                        let popup = document.getElementsByClassName('drop-pop-holder')[0];
                        //Selecting the dropdown items in filter overlay
                        let items = popup.getElementsByClassName('drop-items')[0].children;
                        //Iterating through each element and hide the items which are not present in the list
                        items.forEach((item) => {
                            let filterType = item.getElementsByClassName('item-text')[0].innerText;
                            if (!itemsToShow.includes(filterType)) {
                                item.classList.add("ng-hide");
                            }
                        })
                    }, 100)
                }


                let dashboard = args.dashboard;
                //Checking if the dashboard is present in the configuration file
                if (mod.dashboards.includes(dashboard.oid)) {
                    let dateFilters = []
                    //Selecting the right filter panel
                    let rightPanel = document.getElementById("prism-rightview");
                    //Selecting the filters in right filter panel
                    let filters = rightPanel.getElementsByClassName("f-wrapper");

                    //Indentifying the datetime filters using dashboard metadata
                    let dbIndex = 0;
                    dashboard.filters.$$items.forEach((filter) => {
                        if (filter.isCascading) {
                            filter.levels.forEach((casFilter) => {
                                if (casFilter.datatype == 'datetime') {
                                    dateFilters.push(dbIndex)
                                }
                                dbIndex = dbIndex + 1;
                            })
                        } else {
                            if (filter.jaql.datatype == 'datetime') {
                                dateFilters.push(dbIndex)
                            }
                            dbIndex = dbIndex + 1;
                        }
                    })

                    //For datatime filters adding additional event listener on the edit filter button to hide the options other than List


                    let filIdx = 0;
                    filters.forEach(function (item) {
                        let act_ele = item.getElementsByClassName("ew-i-fx");
                        act_ele.forEach((element) => {
                            if (dateFilters.includes(filIdx)) {
                                element.removeEventListener("click", maskFilterOptions);
                                element.addEventListener("click", maskFilterOptions);
                            }
                            filIdx = filIdx + 1;
                        })
                    });
                }
            }, 1000);
        }
    });
}])