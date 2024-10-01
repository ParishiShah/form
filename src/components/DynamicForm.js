import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../App.css'

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Fieldset = styled.fieldset`
  margin-bottom: 20px;
  border: none;
`;

const Legend = styled.legend`
  font-size: 1.5em;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
`;

const InputWrapper = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  // display: flex;
  // align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const DynamicForm = ({ formJson }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []); 

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      const updatedValues = formData[name] || []; 
      setFormData({
        ...formData,
        [name]: checked ? [...updatedValues, value] : updatedValues.filter(val => val !== value)
      });
    } 
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("formData", JSON.stringify(formData));
    alert('Form Submitted!');
    // Reload the page to reflect updated data
    window.location.reload();
  };

  const renderFields = (fields) => {
    return fields.map((field) => {
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'number':
          return (
            <InputWrapper key={field.name}>
              <Label>{field.label}</Label>
              {field.type === 'textarea' ? (
                <Input
                  as="textarea"
                  name={field.name}
                  placeholder={field.placeholder || ''}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  required={field.required || false}
                />
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder || ''}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  required={field.required || false}
                  min={field.min || undefined}
                  max={field.max || undefined}
                />
              )}
            </InputWrapper>
          );
        case 'dropdown':
          return (
            <InputWrapper key={field.name}>
              <Label>{field.label}</Label>
              <Select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required || false}
              >
                <option value="">Select an option</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </InputWrapper>
          );
        case 'radio':
          return (
            <InputWrapper key={field.name}>
              <Label>{field.label}</Label>
              {field.options.map((option) => (
                <Label key={option.value}>
                  <Input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={handleInputChange}
                    className="auto-width-input"
                    required={field.required || false}
                  />
                  {option.label}
                </Label>
              ))}
            </InputWrapper>
          );
        case 'checkbox':
          return (
            <InputWrapper key={field.name}>
              <Label>{field.label}</Label>
              {field.options.map((option) => (
                <Label key={option.value}>
                  <Input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name]?.includes(option.value)}
                    onChange={handleInputChange}
                    className='auto-width-input'
                  />
                  {option.label}
                </Label>
              ))}
            </InputWrapper>
          );
        case 'slider':
          return (
            <InputWrapper key={field.name}>
              <Label>{field.label}</Label>
              <Input
                type="range"
                name={field.name}
                min={field.min}
                max={field.max}
                step={field.step}
                value={formData[field.name] || field.min}
                onChange={handleInputChange}
              />
              <span>{formData[field.name] || field.min}</span>
            </InputWrapper>
          );
        default:
          return null;
      }
    });
  };

  if (!formJson || !formJson.form) {
    return <div>Loading...</div>;
  }

  return (
    <FormContainer>
      <h2>{formJson.form.title}</h2>
      <p>{formJson.form.description}</p>
      <form onSubmit={handleSubmit}>
        {formJson.form.groups.map((group, index) => (
          <Fieldset key={index}>
            <Legend>{group.title}</Legend>
            {renderFields(group.fields)}
          </Fieldset>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
  );
};

export default DynamicForm;
