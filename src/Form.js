import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import "./Form.css";

const Form = () => {
  const defaultValue = {
    name: "",
    role: "",
    gender: "",
    email: "",
    password: "",
    checkbox: false,
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState(defaultValue);
  const [errors, setErrors] = useState({ ...defaultValue, checkbox: "" });

  useEffect(() => {
    schema.isValid(formState).then((valid) => {
      // console.log(valid);
      setButtonDisabled(!valid);
    });
  }, [formState]);

  let schema = yup.object().shape({
    name: yup.string().required("Enter a name"),
    role: yup.string().ensure().required("Select a role"),
    email: yup
      .string()
      .required("Please provide an email")
      .email("This is not a valid email")
      .notOneOf(["waffle@syrup.com"], "That email is already taken."),
    gender: yup.string().required("You need to select your gender"),
    password: yup.string().min(5).required("You need to enter a password"),
    checkbox: yup.boolean().oneOf([true], "Did you agree to the terms?"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted!");
    setFormState(defaultValue);
    axios
      .post("https://reqres.in/api/users", formState)
      .then((response) => {
        setUsers([...users, response.data]);
      })
      .catch((err) => console.log(err));
  };

  const validateForm = (e) => {
    e.persist();
    let name =
      e.target.name === "male" ||
      e.target.name === "female" ||
      e.target.name === "other"
        ? "gender"
        : e.target.name;
    yup
      .reach(schema, name)
      .validate(
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
      .then((valid) => setErrors({ ...errors, [name]: "" }))
      .catch((error) => {
        setErrors({ ...errors, [name]: error.errors[0] });
      });
  };

  const handleChange = (e) => {
    let value =
      e.target.name === "checkbox" ? e.target.checked : e.target.value;

    let name =
      e.target.name === "male" ||
      e.target.name === "female" ||
      e.target.name === "other"
        ? "gender"
        : e.target.name;

    console.log(name);

    setFormState({
      ...formState,
      [name]: value,
    });
    validateForm(e);
    console.log(formState.gender);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            name="name"
            value={formState.name || ""}
            onChange={handleChange}
          />
        </label>
        <p className="errors">{errors.name}</p>
        <label htmlFor="role">Role:</label>
        <select
          name="role"
          id="role"
          value={formState.role}
          onChange={handleChange}
        >
          <option value="">Select...</option>
          <option value="Designer">Designer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Project Manager">Project Manager</option>
        </select>
        <p className="errors">{errors.role}</p>
        <p style={{marginTop: "10px"}}>Gender:</p>
        <div className="radio">
          <label>
            <input
              type="radio"
              name="male"
              value="Male"
              checked={formState.gender === "Male" ? true : false}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="female"
              value="Female"
              checked={formState.gender === "Female" ? true : false}
              onChange={handleChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="other"
              value="Other"
              checked={formState.gender === "Other" ? true : false}
              onChange={handleChange}
            />
            Other
          </label>
        </div>
        <p className="errors">{errors.gender}</p>
        <label htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            name="email"
            value={formState.email || ""}
            onChange={handleChange}
          />
        </label>
        <p className="errors">{errors.email}</p>
        <label htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            name="password"
            value={formState.password || ""}
            onChange={handleChange}
          />
        </label>
        <p className="errors">{errors.password}</p>
        <p className="errors">{errors.checkbox}</p>
        <label htmlFor="checkbox">
          Terms of Service:
          <input
            id="checkbox"
            type="checkbox"
            name="checkbox"
            checked={formState.checkbox}
            value={formState.checkbox}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={buttonDisabled}>
          Submit!
        </button>
      </form>
      <h3>List of Users</h3>
      {users.map((user) => (
        <div key={user.id} className="card">
          <p>Name: {user.name}</p>
          <p>Role: {user.role}</p>
          <p>Gender: {user.gender}</p>
          <p>Email: {user.email}</p>
          <p>Password: {user.password}</p>
          <p>Terms Accepted: {user.checkbox === true ? "Yes" : "No"}</p>
          {/* <pre key={user.id}>{JSON.stringify(user, null, 2)}</pre> */}
        </div>
      ))}
    </div>
  );
};

export default Form;
