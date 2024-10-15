"use client";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Save, Settings, Trash } from "lucide-react";
import { SpeechRecognitionService } from "../../../backend/utils/speechRecognition";
import { body } from "framer-motion/client";

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
  onSave: (note: Omit<Note, "_id">) => void
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSave, }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query


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
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState("");



  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    fetchCategories();
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
  useEffect(() => {
    // Obtener categorías únicas a partir de las notas actuales
    const uniqueCategories = notes
      .map(note => note.category)
      .filter((category, index, self) => self.indexOf(category) === index); // Filtrar categorías únicas
  
    setCategories(uniqueCategories);
  
    // Si la categoría seleccionada ya no existe, resetea la selección
    if (!uniqueCategories.includes(selectedCategory)) {
      setSelectedCategory("");
    }
  }, [notes]); // Se actualiza cada vez que cambien las notas

  const [isEditingTitle, setIsEditingTitle] = useState(false);
const handleTitleClick = () => {
  setIsEditingTitle(true);
};

const handleIAClick = async () => {
  //TODO Implementar la funcionalidad de IA
  console.log("Consejo IA:", text);
  //if (!selectedNoteId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/upgradeNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: text }), // Envía el contenido actualizado
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upgrade note: ${response.status}`);
      }
  
      const updatedNote = await response.json();
      alert("Consejo IA: " + updatedNote.content);
      console.log("Consejo IA:", updatedNote);
  
      // Vuelve a cargar la lista de notas
      fetchNotes();
    } catch (error) {
      console.error("Error upgrading note:", error);
    }
};

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSelectedNoteTitle(e.target.value);
};

const handleTitleBlur = async () => {
  setIsEditingTitle(false);
  await updateNoteTitle(selectedNoteId, selectedNoteTitle); // Llama a la función para guardar el título
};

const updateNoteTitle = async (noteId: string | null, title: string) => {
  if (!noteId) return;

  try {
    const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title }), // Solo actualiza el título
    });

    if (!response.ok) {
      throw new Error(`Failed to update title: ${response.status}`);
    }

    const updatedNote = await response.json();
    console.log("Título actualizado:", updatedNote);
    fetchNotes(); // Vuelve a cargar la lista de notas
    fetchCategories();
  } catch (error) {
    console.error("Error updating title:", error);
  }
};

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
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === "" || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
const fetchCategories = async () => {
  setLoadingCategories(true);
  try {
    const response = await fetch("http://localhost:5000/api/categories", {headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },});
    if (!response.ok) {
      throw new Error("Error al cargar categorías.");
    }
    const data = await response.json();
    setCategories(data.categories);
  } catch (error) {
    setErrorCategories("Error al cargar categorías: " + error);
  }
  finally {
    setLoadingCategories(false);
  }
};

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  

  const fetchNotes = async (search = "") => {
    setLoading(true);
    try {
      const pageQuery = search ? "" : `page=${currentPage}`;
      const searchQuery = search ? `&search=${search}` : "";
  
      const response = await fetch(`http://localhost:5000/api/notes?${pageQuery}${searchQuery}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
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

  const updateNote = async () => {
    if (!selectedNoteId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: text }), // Envía el contenido actualizado
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`);
      }
  
      const updatedNote = await response.json();
      console.log("Nota actualizada:", updatedNote);
  
      // Vuelve a cargar la lista de notas
      fetchNotes();
      fetchCategories();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  
  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNoteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status}`);
      }
  
      console.log("Nota eliminada:", selectedNoteId);
      setText(""); // Limpia el contenido de la nota
      setSelectedNoteTitle(""); // Limpia el título de la nota
      setSelectedNoteId(null); // Limpia el ID de la nota seleccionada
   // Actualizar el estado de las notas filtradas eliminando la nota
   const updatedNotes = notes.filter((note) => note._id !== selectedNoteId);
   setNotes(updatedNotes);
      // Vuelve a cargar la lista de notas
      const hasNotesWithSelectedCategory = updatedNotes.some(
        (note) => note.category === selectedCategory
      );
  
      if (!hasNotesWithSelectedCategory) {
        setSelectedCategory(""); // Restablecer la selección de categoría si ya no hay notas con esa categoría
      }
      fetchNotes();
      fetchCategories();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
  
  

  console.log('*Compras\n\n Alimentos:\n\t+ Cereal\n\t+ Carne\n\t+ Huevos\n\t+ Comida para el perro y para el gato\n* Artículos de higiene:\n\t+ Papel higiénico\n\t+ Crema dental\n* Bebidas:\n\t+ Leche\n\n*Fin de mes\n\n Fecha límite: [fecha del fin de mes]\n* Presupuesto: 1.000.000 de pesos\n\n*Estructura*\n\nLa nota está organizada por categorías (compras, fin de mes) y subcategorías (alimentos, artículos de higiene, etc.) para facilitar la ubicación rápida y eficiente de la información.')
  
  
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

      console.log("Cuerpo de la solicitud:", noteWithUserId);

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
      console.log("Nota creada:", newNote);

      fetchNotes();
      fetchCategories();
      setError(null);
    } catch (error) {
      setError("Error creating note: " + (error as Error).message);
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
        onSave={createNote}  />
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
    {/* Combobox para seleccionar categoría */}
    <select
      className="bg-gray-700 w-full p-2 rounded text-white"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category state
    >
      <option value="">Todas las categorías</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
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
              setText(note.content);
              setSelectedNoteId(note._id); // Guarda el ID de la nota seleccionada
              setSelectedNoteTitle(note.title);
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
    <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
      Next
    </Button>
  </div>
</div>

      <div className="flex-1 p-4">
      <div>
  {isEditingTitle ? (
    <input
    type="text"
    value={selectedNoteTitle}
    onChange={handleTitleChange}
    onBlur={handleTitleBlur}
    autoFocus
    className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none w-full bg-transparent"
  />
  
  ) : (
    <h1
      className="text-xl font-bold cursor-pointer"
      onClick={handleTitleClick}
    >
      {selectedNoteTitle || "Titulo de la nota"}
    </h1>
  )}
</div>

        <div className="border border-gray-600 p-4 rounded">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Escribe aquí..."
            rows={1}
            className="bg-gray-800 text-white border-none resize-none overflow-auto max-h-full w-full" // Added w-full to make it full width
            style={{
              overflowY: 'auto',
              maxHeight: '78vh', // Calculate max height considering other elements
            }} // Optional: You can also set a specific height
          />
          <div className="flex justify-between items-center mt-2">
            <Button onClick={handleMicClick}>
              <Mic />
            </Button>
            <Button onClick={updateNote}>
  <Save />
</Button>

            <Button onClick={handleIAClick}>
              <Settings />
            </Button>
            <Button onClick={handleDeleteNote}>
              <Trash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )}
