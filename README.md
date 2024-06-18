# Timesheet
This is a simple project tracking timesheet app for calculating hours worked using start and end times.

This project is built using Electron, React and Vite.

## Taskbar Icon
Move icon into taskbar otherwise parts of the app might be hidden off screen, clicking the Icon will reveal app.
Right clicking gives options to disable _Hide on Blur_ and to _close_ the app.

Hide on blur: when clicking off the app, it will minimise it into the system tray.
Close: will completely exit the app.

## Adding Items

Adding an Item gives you options for a Name, Description, and Start Time.
End time can be automatically calculated based on the next item added, or by unticking _Calculate End Time_ a time input will be revealed.

## Editing Items

After adding an item, you might find that you set the wrong, name description or times, or maybe just added it to the wrong date. On the task card click the Edit button to edit any properties of the task, click it again to save changes.
