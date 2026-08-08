import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: note.content,
    openGraph: {
      title: note.title,
      description: note.content,
      url: `http://localhost:3000/notes/${id}`,
      images: ["/og-image.png"],
    },
  };
}


const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  console.log("note id:", id);

  
 const queryClient = new QueryClient();

 await queryClient.prefetchQuery({
   queryKey: ["note", id],
   queryFn: () => fetchNoteById(id),
 });

 return (
   <HydrationBoundary state={dehydrate(queryClient)}>
     <NoteDetailsClient />
   </HydrationBoundary>
 );
};

export default NoteDetails;
