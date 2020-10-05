import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import "./Form.css";

const Form = () => {
  const defaultValue = {
    name: "",
    email: "",
    password: "",
    checkbox: false,
  };

  const [formState, setFormState] = useState(defaultValue);

  const [errors, setErrors] = useState({ ...defaultValue, checkbox: "" });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    schema.isValid(formState).then((valid) => {
      // console.log(valid);
      setButtonDisabled(!valid);
    });
  }, [formState]);

  let schema = yup.object().shape({
    name: yup.string().required("Enter a name"),
    email: yup
      .string()
      .required("Please provide an email")
      .email("This is not a valid email"),
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
        console.log(users);
      })
      .catch((err) => console.log(err));
  };

  const validateForm = (e) => {
    e.persist();
    yup
      .reach(schema, e.target.name)
      .validate(
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
      .then((valid) => setErrors({ ...errors, [e.target.name]: "" }))
      .catch((error) => {
        setErrors({ ...errors, [e.target.name]: error.errors[0] });
        console.log(errors);
      });
  };

  const handleChange = (e) => {
    let value =
      e.target.name === "checkbox" ? e.target.checked : e.target.value;
    setFormState({
      ...formState,
      [e.target.name]: value,
    });
    validateForm(e);
    console.log(formState);
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
        <pre key={user.id}>{JSON.stringify(user, null, 2)}</pre>
      ))}
    </div>
  );
};

export default Form;
