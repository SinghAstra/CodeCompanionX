import { useState } from "react";
import AddEmployee from "./components/AddEmployee";
import AssignTeam from "./components/AssignTeam";
import EditEmployee from "./components/EditEmployee";
import EmployeeList from "./components/EmployeeList";
import employeeData from "./data/employeeData";

function App() {
  const [employees, setEmployees] = useState(employeeData);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addEmployee = (employee) => {
    setEmployees([{ ...employee, id: employees.length + 1 }, ...employees]);
  };

  const updateTeam = (employeeName, newTeam) => {
    setEmployees(
      employees.map((employee) =>
        employee.name === employeeName
          ? { ...employee, team: newTeam }
          : employee
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? { ...employee, ...updatedEmployee } : employee
      )
    );
    setEditingEmployee(null);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Employee Management App</h1>
      {editingEmployee ? (
        <EditEmployee employee={editingEmployee} onUpdate={updateEmployee} />
      ) : (
        <>
          <input
            type="text"
            placeholder="Search employees by name or team"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddEmployee onAdd={addEmployee} />
          <EmployeeList
            employees={filteredEmployees}
            onDelete={deleteEmployee}
            onEdit={setEditingEmployee}
          />
          <AssignTeam employees={employees} onUpdate={updateTeam} />
        </>
      )}
    </div>
  );
}

export default App;
