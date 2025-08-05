import EventForm from '../components/EventForm';

function EventCreate() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <EventForm />
    </div>
  );
}

export default EventCreate;
