# Concordia .ics Builder

Easily add your Concordia schedule to your favourite calendar app.

This tool helps you generate an iCalendar (.ics) ([RFC5545](https://datatracker.ietf.org/doc/html/rfc5545)) from your Student Centre's course schedule.

[Live deployment](https://neeku.dev/concordia-ics-builder/)

## Features

- Schedule table parsing from [Student Center > Academics](https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U&TargetFrameName=None) and screenshots (WIP)
- Add/Edit/Remove courses and their locations, days and start/end times
- Prepopulated and customizable semester start/end dates, and excluded dates (holidays, reading week)
- Validated iCalendar generation according to its latest spec ([RFC7986](https://datatracker.ietf.org/doc/html/rfc7986))
- Compatible with mobile .ics quirks on Android and iOS
- Bound to Concordia University's local time zone (America/Toronto) no matter your device's time
