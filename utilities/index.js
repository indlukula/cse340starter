const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
    row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the options HTML for classification select element
 ************************** */
Util.getClassificationOptions = async function (selectedId) {
  let data = await invModel.getClassifications();
  let options = "";
  data.rows.forEach((row) => {
    const isSelected =
      Number(row.classification_id) === Number(selectedId) ? "selected" : "";
    options += `<option value="${row.classification_id}" ${isSelected}>${row.classification_name}</option>`;
  });
  return options;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid 
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.invModel
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the detail view HTML
 * ************************************ */

Util.buildCarDetail = async function (data) {
  let content = `
    <div class="car-details">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      <div class="car-info">
        <h4>${data.inv_make} ${data.inv_model} - ${data.inv_year} Details</h4>
        <p class="price">Price: $${new Intl.NumberFormat("en-US").format(
          data.inv_price
        )}</p>
        <p class="miles">Miles: ${new Intl.NumberFormat("en-US").format(
          data.inv_miles
        )}</p>
        <p class="description">${data.inv_description}</p>
        <p class="color">Color: ${data.inv_color}</p>
      </div>
    </div>`
  return content
}

/* ****************************************
 * Set up the view for the vehicle detail page
 **************************************** */
Util.buildInventoryDetailView = async function(vehicle){
  let grid
  let data = vehicle[0]
  if (data){
    grid = '<div id="vehicle-details-page">'
    grid += '<img src="' + data.inv_image 
    +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
    +' on CSE Motors" />'
    grid += '<div id="vehicle-details">'
    grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details </h2>'
    grid += '<ul class="vehicle-details-list">'
    grid += '<li><strong>Price: $</strong>' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    grid += '<li><strong>Description: </strong>' + data.inv_description +'</li>'
    grid += '<li><strong>Color: </strong>' + data.inv_color +'</li>'
    grid += '<li><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(data.inv_miles) +'</li>'
    grid += '</ul>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildManagementLinks = async function() {
  let links
  links = '<a class="management-links" href="../../inv/add-classification"><h2>Add New Classification</h2></a>'
  links += '<a class="management-links" href="../../inv/add-inventory"><h2>Add New Vehicle</h2></a>'
  return links
}

// Util.getDropDownClassification = async function (req, res, next) {
//   let data = await invModel.getClassifications()
//   let select = '<label for="classification_id">Classification</label>'
//   select += '<select id="classification_id" name="classification_id">'
//   data.rows.forEach((row) => {
//     select += '<option value="' + row.classification_id + '">' + row.classification_name + '</option>'
//   })
//   select += "</select>"
//   return select
// }

Util.selectClassification = async function (selectedClassificationId) {
  let data = await invModel.getClassifications();
  let select = '<label for="classification_id">Select Classification: </label><br>';
  select += '<select id="classification_id" name="classification_id">';
  data.rows.forEach((row) => {
    select += '<option value="' + row.classification_id + '"';
    if (row.classification_id == selectedClassificationId) {
      select += ' selected';
    }
    select += '>' + row.classification_name + '</option>';
  });
  select += '</select>';
  return select;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
 
 /* ****************************************
 *  Check Account Type for Authorization
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
    // Use the checkLogin function
    Util.checkLogin(req, res, () => {
      // If checkLogin calls next(), the user is logged in

      console.log("checkAccountType");

      // Check the account type
      const accountType = res.locals.accountData.account_type;
      if (!(accountType === "Employee" || accountType === "Admin")) {
        //  restrict access - Clients not allowed
        req.flash("notice", "You do not have permission to access that page.");
        return res.redirect("/account/login");
      }

      // If the account type is "Employee" or "Admin", proceed to the next middleware
      next()
    })
  }





//  Util.checkAccountType = (req, res, next) => {
//   if (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin") {
//     next()
//   } else {
//     req.flash("notice", "You are not authorized. Please log in!.")
//     return res.redirect("/account/login")
//   }
// }

// Util.checkAccountType =(isLoggedIn, accountType) => {
//   let managementGrid
  
//   if (isLoggedIn && (accountType === "Admin" || accountType === "Employee")) {
//     managementGrid = '<h2> Inventory Management </h2>'
//     managementGrid += '<a id="inv-management-button" href="../../inv/" title="Inventory Management View "><h3>Manage Inventory</h3></a>'
//   }else{
//     managementGrid = ''
//   }
//   return managementGrid
// }
 


module.exports = Util