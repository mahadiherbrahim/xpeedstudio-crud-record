import React, { useEffect, useState } from 'react';
import notify from '../notify';
import Header from '../Header/Header'
import './GetForm.css'
const GetForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStructure, setFormStructure] = useState({});
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetch("http://localhost/api/get_form.php")
            .then(res => res.json())
            .then(result => {
                const data = result.data.fields[0]
                setFormStructure(data);
                const newFormData = {};
                Object.keys(data).forEach(k => {
                    if (data[k].type === "select" || data[k].type === "radio") {
                        newFormData[k] = data[k].default;
                    }
                });
                setFormData(newFormData);
                setIsLoading(false);
            })
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);


        fetch("http://localhost/api/submit_form.php", {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(({ status, messages }) => {
                setIsSubmitting(false);
                messages.forEach(msg => notify(status, msg));
            });
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData };
        newFormData[name] = value;
        setFormData(newFormData);
    }

    function makeInputElement(key) {
        const data = formStructure[key];
        const { title, type, value, required, html_attr } = data;
        if (type !== "radio" && type !== "select") {
            return (
                <div key={key} >
                    <label>{title}
                        <input onChange={e => handleInput(e)} type={type} name={key} defaultValue={value} required={required} {...html_attr} />
                    </label>
                </div>
            )
        } else {
            const { default: defaultValue, options } = data;
            if (type === "select") {
                return (
                    <div key={key} >
                        <label>{title}
                            <select onChange={e => handleInput(e)} name={key} defaultValue={defaultValue} required={required} {...html_attr}  >
                                {
                                    options.map(({ key: val, label }) => <option key={val} value={val}>{label}</option>)
                                }
                            </select>
                        </label>
                    </div>
                )
            } else {
                return (
                    <div key={key} >
                        <p>{title}</p>
                        {
                            options.map(({ key: val, label }) => <label key={val} >
                                <input onChange={e => handleInput(e)} name={key} type="radio" value={val} {...html_attr} checked={val === defaultValue} />
                                {label}
                            </label>)
                        }
                        <label>{title}
                        </label>
                    </div>
                )
            }
        }

    }
    return (
        isLoading ? "Loading" :
            <div className="container">
                <Header></Header>
                <div className="form-container">

                    <form onSubmit={handleSubmit}>
                        {
                            Object.keys(formStructure).map(key => makeInputElement(key))
                        }
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting} >{isSubmitting ? "Submitting" : "Submit"}</button>
                    </form>
                </div>
            </div>
    );
};

export default GetForm;