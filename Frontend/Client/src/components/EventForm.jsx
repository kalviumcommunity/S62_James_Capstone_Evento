import React from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const EventCreationForm = () => {
  return (
    <>
      <h1>Create New Event</h1>
      <Formik
        initialValues={{
          title: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          organizer: '',
          contact: '',
          eventType: '',
          tags: '',
          registrationLink: '',
          poster: null,
        }}
        validationSchema={Yup.object({
          title: Yup.string().required('Required'),
          description: Yup.string().required('Required'),
          date: Yup.date().required('Required'),
          time: Yup.string().required('Required'),
          venue: Yup.string().required('Required'),
          organizer: Yup.string().required('Required'),
          contact: Yup.string().required('Required'),
          eventType: Yup.string().required('Required'),
          tags: Yup.string().required('Required'),
          registrationLink: Yup.string().url('Invalid URL').nullable(),
          poster: Yup.mixed().required('Poster is required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          for (let key in values) {
            formData.append(key, values[key]);
          }
          console.log([...formData]); // For now
          setTimeout(() => {
            alert('Event submitted!');
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ setFieldValue }) => (
          <Form encType="multipart/form-data">
            <MyTextInput label="Event Title" name="title" type="text" placeholder="Street Play" />
            <MyTextArea label="Description" name="description" placeholder="What's this event about?" />
            <MyTextInput label="Date" name="date" type="date" />
            <MyTextInput label="Time" name="time" type="time" />
            <MyTextInput label="Venue" name="venue" type="text" placeholder="In front of Open Audi" />
            <MyTextInput label="Organizer" name="organizer" type="text" placeholder="House of Misfits" />
            <MyTextInput label="Contact Info" name="contact" type="text" placeholder="Deep TöpPö, +91..." />
            
            <MySelect label="Event Type" name="eventType">
              <option value="">Select type</option>
              <option value="Drama">Drama</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </MySelect>

            <MyTextInput label="Tags (comma-separated)" name="tags" type="text" placeholder="drama, roopantaran" />
            <MyTextInput label="Registration Link" name="registrationLink" type="url" placeholder="https://..." />

            <div>
              <label htmlFor="poster">Upload Poster</label>
              <input
                name="poster"
                type="file"
                onChange={(event) => {
                  setFieldValue("poster", event.currentTarget.files[0]);
                }}
                accept="image/*"
              />
            </div>

            <button type="submit">Create Event</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EventCreationForm;
