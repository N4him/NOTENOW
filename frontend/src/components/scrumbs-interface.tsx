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

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, "_id">) => void;
  initialContent?: string; // New prop for passing initial content
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent = "", // Default empty if no content passed
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(initialContent); // Start with initialContent
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

  useEffect(() => {
    setContent(initialContent); // Update content when initialContent changes
  }, [initialContent]);

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
  const [textareaContent, setTextareaContent] = useState(""); // For storing the textarea content before saving
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);
  const lastTranscriptRef = useRef("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteContent, setSelectedNoteContent] = useState("");

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
            setText((prevText) => {
              const updatedText = prevText + transcript + " ";
              setSelectedNoteContent(updatedText); // Actualiza el contenido seleccionado
              return updatedText;
            });
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

  // Filter notes based on the search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const fetchNotes = async (search = "") => {
    setLoading(true);
    try {
      const pageQuery = search ? "" : `page=${currentPage}`;
      const searchQuery = search ? `&search=${search}` : "";

      const response = await fetch(
        `http://localhost:5000/api/notes?${pageQuery}${searchQuery}`,
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
      console.log("Data received:", data);

      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        setError(null);
        setTotalPages(data.pagination?.totalPages || 1); // Solo usa paginación si no hay búsqueda
      } else {
        throw new Error("Response does not contain notes array");
      }
    } catch (error) {
      setError("No tienes notas aún, crea una nueva nota arriba :)");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(
    "*Compras\n\n Alimentos:\n\t+ Cereal\n\t+ Carne\n\t+ Huevos\n\t+ Comida para el perro y para el gato\n* Artículos de higiene:\n\t+ Papel higiénico\n\t+ Crema dental\n* Bebidas:\n\t+ Leche\n\n*Fin de mes\n\n Fecha límite: [fecha del fin de mes]\n* Presupuesto: 1.000.000 de pesos\n\n*Estructura*\n\nLa nota está organizada por categorías (compras, fin de mes) y subcategorías (alimentos, artículos de higiene, etc.) para facilitar la ubicación rápida y eficiente de la información."
  );

  useEffect(() => {
    fetchNotes(searchQuery); // Pass the search query to fetchNotes
  }, [currentPage, searchQuery]); // Include searchQuery in the dependencies

  const createNote = async (note: Omit<Note, "_id">) => {
    try {
      const userId = localStorage.getItem("userId");
      const noteWithUserId = {
        ...note,
        userId: userId,
      };

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
      fetchNotes();
      setError(null);
    } catch (error) {
      setError("Error creando la nota: " + (error as Error).message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={createNote}
        initialContent={textareaContent} // Pass textarea content to modal
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
          <Input
            placeholder="Busca tu nota"
            className="bg-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          />
          <div className="space-y-1">
            {loading ? (
              <p>Cargando notas...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              filteredNotes.map((note) => (
                <Button
                  key={`${note._id}-${note.createdAt}`}
                  variant="ghost"
                  className="w-full justify-start text-left overflow-wrap break-words"
                  style={{ whiteSpace: "normal" }}
                  onClick={() => {
                    setSelectedNoteTitle(note.title); // Actualiza el título seleccionado
                    setSelectedNoteContent(note.content); // Actualiza el contenido seleccionado
                  }}
                >
                  {note.title}: {note.content}
                </Button>
              ))
            )}
          </div>
        </div>
        {/* Pagination Buttons */}
        <div className="flex justify-between mt-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold">
          {selectedNoteTitle || "Titulo de la nota"}
        </h1>
        <div className="mb-6">
          <Textarea
            ref={textareaRef}
            placeholder="Escribe aquí..."
            className="w-full min-h-[100px] bg-gray-800 border border-gray-700 text-white placeholder-gray-400 resize-none overflow-hidden"
            value={selectedNoteContent} // Actualiza el contenido dinámicamente
            onChange={(e) => setSelectedNoteContent(e.target.value)} // Permitir que el contenido se edite
          />

          <div className="flex justify-end mt-2 space-x-2">
            <Button
              onClick={handleMicClick}
              variant={isRecording ? "destructive" : "default"}
            >
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? "Grabando..." : "Grabar"}
            </Button>
            <Button
              onClick={() => {
                setTextareaContent(text); // Save textarea content before opening modal
                setIsModalOpen(true); // Open the modal
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
