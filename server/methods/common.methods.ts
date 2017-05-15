import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    "fetchStats": () => {
      let activeSuppliers = Meteor.call("users.count",{"roles": "supplier","$or": [{ active: true }, { active: { $exists: false } }] }, "");
      let inactiveSuppliers = Meteor.call("users.count",{"roles": "supplier","active": false}, "");
      let activeCustomers = Meteor.call("users.count",{"roles": "customer","$or": [{ active: true }, { active: { $exists: false } }] }, "");
      let inactiveCustomers = Meteor.call("users.count",{"roles": "customer","active": false}, "");
      let totalTours = Meteor.call("tours.find", {}, {}, "", true);
      let approvedTours = Meteor.call("tours.find", {}, {"approved": true}, "", true);
      let totalBookings = Meteor.call("bookings.find",{}, {}, "", true);
      let confirmedBooking = Meteor.call("bookings.find",{}, {"confirmed": true, "cancelled": false}, "", true);
      let nowDate = new Date();
      let currentMonth = new Date(nowDate.setMonth(nowDate.getMonth() - 1));
      let lastMonth = new Date(nowDate.setMonth(nowDate.getMonth() - 2));
      let sixMonths = new Date(nowDate.setMonth(nowDate.getMonth() - 6));
      let criteria = {
        bookingDate: {
          $gte: currentMonth,
          $lte: new Date()
        }
      };
      let currentMonthSales = Meteor.call("bookings.statistics.new", criteria);
      if (currentMonthSales.length == 0) {
        currentMonthSales = [{totalPriceDefault: 0}];
      }

      criteria = {
        bookingDate: {
          $gte: lastMonth,
          $lte: currentMonth
        }
      };
      let lastMonthSales = Meteor.call("bookings.statistics.new", criteria);
      if (lastMonthSales.length == 0) {
        lastMonthSales = [{totalPriceDefault: 0}];
      }

      criteria = {
        bookingDate: {
          $gte: sixMonths,
          $lte: new Date()
        }
      };
      let last6MonthsSales = Meteor.call("bookings.statistics.new", criteria);
      if (last6MonthsSales.length == 0) {
        last6MonthsSales = [{totalPriceDefault: 0}];
      }

      return {
        activeSuppliers,
        inactiveSuppliers,
        activeCustomers,
        inactiveCustomers,
        totalTours,
        approvedTours,
        totalBookings,
        confirmedBooking,
        currentMonthSales,
        lastMonthSales,
        last6MonthsSales
      };
    },
    "sendEmail": (to: string, subject: string, html: string) => {
    let from = "atorvia12@gmail.com";
    return Email.send({ to, from, subject, html});
    },
    "sendEmailCustom": (to: string, subject: string, text: string) => {
        let Mailgun = require('mailgun').Mailgun;
        let email = new Mailgun('key-755f427d33296fe30862b0278c460e84');
        let domain = "sandbox3f697e79ae2849f5935a5a60e59f9795.mailgun.org";

        email.sendText("noreply@atorvia.com", to, subject, text, domain, (err) => {
          if (err) {
            console.log(err);
          }
        });
    }
})
