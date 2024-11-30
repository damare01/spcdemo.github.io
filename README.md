# Attendance Web Application

An event attendance management system designed to manage and track attendance for events hosted by an institution. The system allows users to register their attendance for events and records their program details along with their attendance status.

---

## Table of Contents

1. [Features](#features)
    - [User Registration for Attendance](#user-registration-for-attendance)
    - [Dynamic Program List](#dynamic-program-list)
    - [Form Submission and Data Recording](#form-submission-and-data-recording)
    - [Automated Email Confirmation](#automated-email-confirmation)
    - [Conditional Form Responses Based on `Attendance Open` Setting](#conditional-form-responses-based-on-attendance-open-setting)
    - [Program-Specific Attendance Sheets](#program-specific-attendance-sheets)
    - [Program Sheet with Full Program Name and Abbreviation](#program-sheet-with-full-program-name-and-abbreviation)
2. [Technologies Used](#technologies-used)
3. [Key Configurations](#key-configurations)
    - [Attendance Open Setting](#attendance-open-setting)
    - [Example of Settings Sheet](#example-of-settings-sheet)
    - [Example of Program Sheet](#example-of-program-sheet)
4. [Setup Instructions](#setup-instructions)
    - [Step 1: Create a Google Sheet](#step-1-create-a-google-sheet)
    - [Step 2: Open the Apps Script Editor](#step-2-open-the-apps-script-editor)
    - [Step 3: Add the Code.gs Script](#step-3-add-the-codegs-script)
    - [Step 4: Add the HTML File](#step-4-add-the-html-file)
    - [Step 5: Deploy the Web App](#step-5-deploy-the-web-app)
    - [Step 6: Authorize the Script](#step-6-authorize-the-script)
    - [Step 7: Access the Web App](#step-7-access-the-web-app)
5. [Future Enhancements](#future-enhancements)

---

## Features

### 1. **User Registration for Attendance**
   - Users can register their attendance for events by filling out a form with the following details:
     - **Full Name**: The user's full name.
     - **Email Address**: The user's email address for event communication.
     - **Year Level**: The user's year level or academic standing.
     - **Program**: The user's academic program (e.g., Bachelor of Science in Nursing or others).

### 2. **Dynamic Program List**
   - The program list is dynamically populated from a Google Spreadsheet, ensuring that any changes to the list of available programs are automatically reflected in the form. Users select their program from this list to register.

### 3. **Form Submission and Data Recording**
   - Upon form submission, the system records the user's attendance details in a **Google Sheet** under the appropriate program and year combination.
   - The system ensures that the user’s data is accurately added, including the program and year. The "Proof Link" for attendance remains marked as "Pending" until further updates (such as proof submission) are integrated.

### 4. **Automated Email Confirmation**
   - Upon successful form submission, the user receives an automated confirmation email. The email includes:
     - Event name
     - User’s program and year level
     - A thank-you note acknowledging their participation in the event
   - This email serves as a formal acknowledgment of their attendance.

### 5. **Conditional Form Responses Based on `Attendance Open` Setting**
   - The system checks if event attendance is open or closed. This is controlled by the `Attendance Open` setting in the Google Sheet under the `settings` tab.
     - **`Attendance Open: Yes/yes`**: Attendance form is open, users can submit their details.
     - **`Attendance Open: No/no`**: Form is closed, users are notified that registration is no longer available.

### 6. **Program-Specific Attendance Sheets**
   - For each program and year combination, a new sheet is created in the Google Spreadsheet to store attendance records.
   - Attendance sheets include columns for:
     - Timestamp
     - User’s Name
     - User’s Email
     - Program
     - Year Level

### 7. **Program Sheet with Full Program Name and Abbreviation**
   - The **Program Sheet** contains two columns:
     - **Program**: Full program name (e.g., Bachelor of Science in Nursing).
     - **Abbreviation**: Shortened version of the program name (e.g., BSN).
   - This sheet is used to dynamically populate the list of available programs in the attendance registration form.

---

## Technologies Used

- **Google Apps Script**: Handles backend logic, form processing, and communication with Google Sheets for data storage and retrieval.
- **Google Sheets**: Stores event-related data, including user attendance and program details.
- **MailApp (Google Apps Script)**: Sends automated email confirmations to users after successful form submissions.
- **HTML/CSS**: Frontend form that users interact with to register their attendance.

---

## Key Configurations

### Attendance Open Setting
- The `Attendance Open` setting is controlled in the `settings` sheet of the Google Spreadsheet. This setting is crucial for managing when users can submit their attendance. The following values can be configured:
  - **`Yes/yes`**: Users can submit their attendance.
  - **`No/no`**: Users will be informed that registration is closed.

### Example of Settings Sheet:

| Setting          | Value   |
|------------------|---------|
| `Event Name`     | Event Name Here |
| `Attendance Open` | Yes/No or yes/no |

- If the `Attendance Open` value is set to `no`, users will see a notification that registration is closed, and the form will not be submitted.

### Example of Program Sheet:

| Program                         | Abbreviation |
|----------------------------------|--------------|
| Bachelor of Science in Nursing   | BSN          |
| Bachelor of Arts in Psychology   | BAP          |
| Master of Business Administration| MBA          |

- The **Program Sheet** is used to populate the list of programs available in the form dynamically.

---

## Setup Instructions

### Step 1: Create a Google Sheet
- Open Google Sheets and create a new spreadsheet.

### Step 2: Open the Apps Script Editor
- In the menu bar, click **Extensions > Apps Script**.

### Step 3: Add the Code.gs Script
1. In the Apps Script editor, ensure you are on the `Code.gs` file.
2. Paste the provided `Code.gs` script into the editor.

### Step 4: Add the HTML File
1. Click the **+** button next to the **Files** tab and select **HTML file**.
2. Name the file `Index` and paste the provided HTML code into the file.

### Step 5: Deploy the Web App
1. Click **Deploy > New deployment**.
2. Set the following:
   - **Type**: Web app.
   - **Execute as**: Me.
   - **Who has access**: Anyone.
3. Click **Deploy**.

### Step 6: Authorize the Script
- Review the permissions requested and click **Authorize**.
- Follow the instructions to grant access.

### Step 7: Access the Web App
- After deployment, copy the provided URL to share and access your app.

> **Note**:  
> If you are using an institutional email, you might encounter authorization restrictions. Use a personal Google account to complete the setup.

---

## Tips for a Smooth Setup

- Ensure your script and HTML are error-free before deployment.
- Test the web app link on different devices to ensure compatibility.
- Use **Manage deployments** for future updates.

---

## Future Enhancements

Future development will include additional features like:
- File upload for attendance proof.
- Better handling of event-specific data.
- Enhanced user interfaces for managing event details.

---

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
