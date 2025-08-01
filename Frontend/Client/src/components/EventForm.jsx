import React from 'react';
import axios from 'axios';
import { Formik, useField } from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-6">
      <label 
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input 
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          meta.touched && meta.error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300'
        }`}
        {...field} 
        {...props} 
      />
      {meta.touched && meta.error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-6">
      <label 
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <textarea 
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical min-h-[120px] ${
          meta.touched && meta.error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300'
        }`}
        {...field} 
        {...props} 
      />
      {meta.touched && meta.error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-6">
      <label 
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <select 
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
          meta.touched && meta.error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300'
        }`}
        {...field} 
        {...props} 
      />
      {meta.touched && meta.error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const EventCreationForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Event</h1>
          
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
              date: Yup.date().required('Required').min(new Date(), 'Date cannot be in past'),
              time: Yup.string().required('Required'),
              venue: Yup.string().required('Required'),
              organizer: Yup.string().required('Required'),
              contact: Yup.string().required('Required'),
              eventType: Yup.string().required('Required'),
              tags: Yup.string().required('Required'),
              registrationLink: Yup.string().url('Invalid URL').nullable(),
              poster: Yup.mixed().required('Required').test('fileSize', 'File too large (max 10MB)', value => value && value.size <= 30 * 1024 * 1024)
              .test('fileType', 'Unsupported format (use JPG/PNG/GIF)', value => 
              value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))
            })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const formData = new FormData();
                  Object.keys(values).forEach((key) => {
                    if (key === 'poster') {
                      formData.append('poster', values.poster, values.poster.name);
                    } else {
                      formData.append(key, values[key]);
                    }
                  });

                  const response = await axios.post('http://localhost:3000/api/events', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });

                  console.log('Event created:', response.data);
                  alert('Event created successfully!');
                  resetForm();
                } catch (error) {
                  console.error('Error submitting form:', error);
                  alert(`Error: ${error.response?.data?.message || error.message}`);
                } finally {
                  setSubmitting(false);
                }
              }}

          >
            {({ setFieldValue, isSubmitting, handleSubmit }) => (
              <form onSubmit = {handleSubmit} className="space-y-0" >
              
                <MyTextInput 
                  label="Event Title" 
                  name="title" 
                  type="text" 
                  placeholder="" 
                />
                
                <MyTextArea 
                  label="Description" 
                  name="description" 
                  placeholder="What's this event about?" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <MyTextInput 
                    label="Date" 
                    name="date" 
                    type="date" 
                  />
                  <MyTextInput 
                    label="Time" 
                    name="time" 
                    type="time" 
                  />
                </div>
                
                <MyTextInput 
                  label="Venue" 
                  name="venue" 
                  type="text" 
                  placeholder="" 
                />
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 pt-3 mb-6">
                  <MyTextInput 
                    label="Organizer*" 
                    name="organizer" 
                    type="text" 
                    placeholder="" 
                  />
                  <MyTextInput 
                    label="Contact Info" 
                    name="contact" 
                    type="text" 
                    placeholder="" 
                  />
                </div>
                
                <MySelect label="Event Type" name="eventType">
                  <option value="">Select type</option>
                  <option value="Drama">Drama</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </MySelect>

              <div className="pt-3"></div>
                <MyTextInput 
                  label="Tags (comma-separated)" 
                  name="tags" 
                  type="text" 
                  placeholder="" 
                />

              <div className="pt-3"></div>
                <MyTextInput 
                  label="Registration Link" 
                  name="registrationLink" 
                  type="url" 
                  placeholder="https://..." 
                />

                <div className="mb-8 pt-3 pb-4" >
                  <label 
                    htmlFor="poster"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Poster
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600" >
                        <label
                          htmlFor="poster"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="poster"
                            name="poster"
                            type="file"
                            className="sr-only"
                            onChange={(event) => {
                              setFieldValue("poster", event.currentTarget.files[0]);
                            }}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  // onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EventCreationForm;