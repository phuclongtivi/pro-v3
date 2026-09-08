import BrandFooter from "@/components/BrandFooter";
import EventStructuredCreateForm from "@/components/EventStructuredCreateForm";

export default function CreateEvent(){
 return <main className="page"><section className="hero"><h1>Tạo sự kiện</h1><p>Event Definition → Event Space → Public Token → QR</p></section>
 <EventStructuredCreateForm/><BrandFooter/></main>
}
