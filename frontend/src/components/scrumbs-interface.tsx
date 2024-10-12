"use client";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Save, Settings } from "lucide-react";
import { SpeechRecognitionService } from "../../../backend/utils/speechRecognition";

const DEBOUNCE_DELAY = 700;

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
}

// Componente del modal para crear una nueva nota
interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, "_id">) => void; // Cambiar a Omit para no incluir _id en el guardado
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    const note: Omit<Note, "_id"> = {
      title,
      content,
      createdAt: new Date().toISOString(),
      category,
    };
    onSave(note);
    setTitle("");
    setContent("");
    setCategory("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white text-gray-900 p-4 rounded-md">
        <h2 className="text-lg font-bold mb-4">Crear Nueva Nota</h2>
        <Input
          placeholder="Título de la nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 bg-gray-200 border border-gray-300"
        />
        <Textarea
          placeholder="Escribe el contenido de tu nota aquí..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] bg-gray-200 border border-gray-300 text-black placeholder-gray-600 resize-none overflow-hidden"
        />
        <Input
          placeholder="Etiquetas (separadas por comas)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 bg-gray-200 border border-gray-300"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Nota</Button>
        </div>
      </div>
    </div>
  );
};

export function ScrumbsInterface() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);
  const lastTranscriptRef = useRef("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    speechServiceRef.current = new SpeechRecognitionService(
      (transcript: string) => {
        if (transcript !== lastTranscriptRef.current) {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }
          debounceTimeoutRef.current = setTimeout(() => {
            setText((prevText) => prevText + transcript + " ");
            lastTranscriptRef.current = transcript;
          }, DEBOUNCE_DELAY);
        }
      },
      () => {
        setIsRecording(false);
      }
    );

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleMicClick = () => {
    if (isRecording) {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (speechServiceRef.current) {
        speechServiceRef.current.start();
      }
      setIsRecording(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const fetchNotes = async (page: number = 2) => {
    setLoading(true);
    try {
        const response = await fetch(
            `http://localhost:5000/api/notes?page=${page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data received:", data); // Mostrar todos los datos recibidos

        if (Array.isArray(data.notes)) {
            setNotes(data.notes);
            setPagination(data.pagination);
            console.log("Pagination updated:", data.pagination); // Comprobar la paginación actualizada
        } else {
            throw new Error("Response does not contain notes array");
        }
    } catch (error) {
        setError("No tienes notas aun, crea una nueva nota arriba :)");
        console.error(error);
    } finally {
        setLoading(false);
    }
};



  const createNote = async (note: Omit<Note, "_id">) => {
    try {
      // Obtén el ID de usuario de localStorage
      const userId = localStorage.getItem("userId"); // Asegúrate de que userId esté guardado aquí

      // Crea la nota incluyendo el ID del usuario
      const noteWithUserId = {
        ...note,
        userId: userId, // Usa el ID de usuario de localStorage
      };

      console.log("Cuerpo de la solicitud:", noteWithUserId); // Verifica qué se envía

      const response = await fetch(`http://localhost:5000/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(noteWithUserId),
      });

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.status}`);
      }

      const newNote = await response.json();
      console.log("Nota creada:", newNote); // Verifica la nota creada

      // Llama a fetchNotes para obtener la lista actualizada de notas
      fetchNotes(); // Esta línea fue añadida
      setError(null);
    } catch (error) {
      setError("Error creating note: " + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handlePreviousPage = () => {
    if (pagination && pagination.page > 1) {
        console.log("Página actual:", pagination.page); // Log de la página actual
        console.log("Navegando a la página anterior:", pagination.page - 1); // Log de la página anterior
        fetchNotes(pagination.page - 1);
    } else {
        console.log("No se puede navegar a la página anterior, ya estás en la primera página."); // Mensaje si ya estás en la primera página
    }
};

const handleNextPage = () => {
  if (pagination && pagination.page < Math.ceil(pagination.total / pagination.limit)) {
    console.log("Página actual:", pagination.page); // Log de la página actual
        console.log("Navegando a la siguiente página:", pagination.page + 1); // Log de la siguiente página
        fetchNotes(pagination.page + 1);
    } else {
        console.log("No se puede navegar a la siguiente página, ya estás en la última página."); // Mensaje si ya estás en la última página
    }
};

useEffect(() => {
  console.log("Paginación actualizada:", pagination);
}, [pagination]);



  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={createNote}
      />
      <div className="w-64 bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Mi Notenow</h1>
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            Nueva Nota
          </Button>
          <Input placeholder="Busca tu nota" className="bg-gray-700" />
          <div className="space-y-1">
            {loading ? (
              <p>Cargando notas...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              notes.map((note) => (
                <Button
                  key={`${note._id}-${note.createdAt}`}
                  variant="ghost"
                  className="w-full justify-start text-left overflow-wrap break-words"
                  style={{ whiteSpace: "normal" }}
                >
                  {note.title}: {note.content}
                </Button>
              ))
            )}
            <div className="flex justify-between mt-4">
            <button onClick={handlePreviousPage} disabled={!pagination || pagination.page <= 1}>Atrás</button>
<button onClick={handleNextPage} disabled={!pagination || pagination.page >= Math.ceil(pagination.total / pagination.limit)}>Siguiente</button>

            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl">Lee Simon</h2>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/path/to/image.jpg" alt="Profile" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button onClick={handleMicClick}>
              <Mic />
              <span>{isRecording ? "Detener" : "Grabar"}</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Escribe tu mensaje..."
            className="resize-none overflow-hidden w-full h-full bg-gray-800 border border-gray-700"
          />
        </main>
        <footer className="p-4 border-t border-gray-700 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => {
              /* Logic to save note */
            }}
          >
            <Save />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              /* Logic for settings */
            }}
          >
            <Settings />
          </Button>
        </footer>
      </div>
    </div>
  );
}
