# company-employee-management-api

Current APIs

Signed Up the Admin Manually.

1. POST /api/login 
    It is to login as an Admin or a User. 
    Example body,

    { 
        username: "adminuser, 
        password: "password"
    }

2. POST /api/companies 
    It is to Add new Company data as Admin.
    Example body,

    { 
        "code": "comp1",
        "name": "company 1"
    }

3. PUT /api/companies/{code}
    It is to modify savedcompany details as Admin.
    Example body,

    { 
        "code": "comp1",
        "name": "company 1"
    }

4. GET /api/companies/{code}
    It is to fetch company details by ID as Admin.

5. POST /api/employees
    It is to Add new Employee as Admin.
    Example body,

    {
        "name": "kaushik",
        "phone": "9876543210",
        "companyCode":"comp1",
        "reportingManagerId": "66e982dbff00d1c05ca0812e"
    }

6.  PUT /api//employees/{ID}
    It is to Modify the saved Employee data as admin.
    Example body,

    {
        "name": "kaushik",
        "phone": "9876543210",
        "companyCode":"comp1",
        "reportingManagerId": "66e982dbff00d1c05ca0812e"
    }

7.  DELETE /api//employees/{ID}
    It is to Delete the Employee data as admin.

8. GET /api/employees/search?{name/id/phone}={}
    It is to fetch employee detail based on their name or id or phone number as admin.

9. GET /api/employees/{id}/subordinates
    It is to fetch all the employees under single manager as admin.

9. GET /api/employees/{id}/manager
    It is to get Manager details based on employee ID provided.

