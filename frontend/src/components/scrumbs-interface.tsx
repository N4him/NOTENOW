"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Save, Settings, Trash, Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react"
import { SpeechRecognitionService } from "../../../backend/utils/speechRecognition"

const DEBOUNCE_DELAY = 700

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  category: string
}

interface CreateNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Omit<Note, "_id">) => void
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")

  const handleSave = () => {
    const note: Omit<Note, "_id"> = {
      title,
      content,
      createdAt: new Date().toISOString(),
      category,
    }
    onSave(note)
    setTitle("")
    setContent("")
    setCategory("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nueva Nota</h2>
        <Input
          placeholder="Título de la nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        <Textarea
          placeholder="Contenido de la nota"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Nota</Button>
        </div>
      </div>
    </div>
  )
}

export  function StyledNoteApp() {
  const [text, setText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null)
  const lastTranscriptRef = useRef("")
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [showAiResponse, setShowAiResponse] = useState(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  useEffect(() => {
    fetchCategories()
    speechServiceRef.current = new SpeechRecognitionService(
      (transcript: string) => {
        if (transcript !== lastTranscriptRef.current) {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }
          debounceTimeoutRef.current = setTimeout(() => {
            setText((prevText) => prevText + transcript + " ")
            lastTranscriptRef.current = transcript
          }, DEBOUNCE_DELAY)
        }
      },
      () => {
        setIsRecording(false)
      }
    )

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const uniqueCategories = notes
      .map(note => note.category)
      .filter((category, index, self) => self.indexOf(category) === index)
    setCategories(uniqueCategories)
    if (!uniqueCategories.includes(selectedCategory)) {
      setSelectedCategory("")
    }
  }, [notes])

  const handleMicClick = () => {
    if (isRecording) {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop()
      }
      setIsRecording(false)
    } else {
      if (speechServiceRef.current) {
        speechServiceRef.current.start()
      }
      setIsRecording(true)
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === "" || note.category === selectedCategory
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Error al cargar categorías.")
      }
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  const fetchNotes = async (search = "") => {
    setLoading(true)
    try {
      const pageQuery = search ? "" : `page=${currentPage}`
      const searchQuery = search ? `&search=${search}` : ""
  
      const response = await fetch(`http://localhost:5000/api/notes?${pageQuery}${searchQuery}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
  
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`)
      }
  
      const data = await response.json()
      console.log("Data received:", data)
  
      if (Array.isArray(data.notes)) {
        setNotes(data.notes)
        setError(null)
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        throw new Error("Response does not contain notes array")
      }
    } catch (error) {
      setError("No tienes notas aún, crea una nueva nota arriba :)")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateNote = async () => {
    if (!selectedNoteId) return
  
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: text }),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`)
      }
  
      const updatedNote = await response.json()
      console.log("Nota actualizada:", updatedNote)
  
      fetchNotes()
      fetchCategories()
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }
  
  const handleDeleteNote = async () => {
    if (!selectedNoteId) return
  
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNoteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status}`)
      }
  
      console.log("Nota eliminada:", selectedNoteId)
      setText("")
      setSelectedNoteTitle("")
      setSelectedNoteId(null)
      const updatedNotes = notes.filter((note) => note._id !== selectedNoteId)
      setNotes(updatedNotes)
      
      const hasNotesWithSelectedCategory = updatedNotes.some(
        (note) => note.category === selectedCategory
      )
  
      if (!hasNotesWithSelectedCategory) {
        setSelectedCategory("")
      }
      fetchNotes()
      fetchCategories()
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const handleAIAssist = async () => {
    try {
      setAiResponse("") // Clear the textarea
      setShowAiResponse(true) // Show the textarea immediately

      const response = await fetch(`http://localhost:5000/api/upgradeNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: text }),
      })

      if (!response.ok) {
        throw new Error(`Failed to upgrade note: ${response.status}`)
      }

      const updatedNote = await response.json()
      setAiResponse(updatedNote.content)
      console.log("Consejo IA:", updatedNote)

      fetchNotes()
    } catch (error) {
      console.error("Error upgrading note:", error)
      setAiResponse("Error: No se pudo obtener la respuesta del asistente IA.")
    }
  }

  useEffect(() => {
    fetchNotes(searchQuery)
  }, [currentPage, searchQuery])

  const createNote = async (note: Omit<Note, "_id">) => {
    try {
      const userId = localStorage.getItem("userId")
      const noteWithUserId = {
        ...note,
        userId: userId,
      }

      console.log("Cuerpo de la solicitud:", noteWithUserId)

      const response = await fetch(`http://localhost:5000/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(noteWithUserId),
      })

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.status}`)
      }

      const newNote = await response.json()
      console.log("Nota creada:", newNote)

      fetchNotes()
      fetchCategories()
      setError(null)
    } catch (error) {
      setError("Error creating note: " + (error as Error).message)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={createNote}
      />
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mi Notenow</h1>
          <Button onClick={() => setIsModalOpen(true)} size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Busca tu nota"
            className="bg-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="space-y-2">
            {loading ? (
              <p>Cargando notas...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              filteredNotes.map((note) => (
                <Button
                  key={`${note._id}-${note.createdAt}`}
                  variant="ghost"
                  className="w-full justify-start text-left overflow-hidden"
                  onClick={() => {
                    setText(note.content)
                    setSelectedNoteId(note._id)
                    setSelectedNoteTitle(note.title)
                    setAiResponse("") // Clear the AI response
                    setShowAiResponse(false) // Hide the AI response textarea
                  }}
                >
                  <div className="truncate">
                    <span className="font-medium">{note.title}: </span>
                    <span className="text-gray-400">{note.content}</span>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            value={selectedNoteTitle}
            onChange={(e) => setSelectedNoteTitle(e.target.value)}
            onBlur={async () => {
              if (selectedNoteId) {
                await updateNote()
              }
            }}
            className="text-3xl font-bold mb-4 w-full bg-transparent border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="Título de la nota"
          />
          <div className="flex space-x-4 flex-col md:flex-row">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aquí..."
              className="w-full min-h-[400px] p-4 bg-gray-800 border border-gray-700 rounded-md resize-none overflow-auto focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {showAiResponse && (
              <div className="w-2/3 relative">
                <Textarea
                  value={aiResponse}
                  readOnly
                  className="w-full min-h-[400px] p-4 bg-gray-800 border border-gray-700 rounded-md resize-none overflow-auto"
                  placeholder="Respuesta del Asistente IA"
                />
                <Button
                  onClick={() => setShowAiResponse(false)}
                  className="absolute top-2 right-2"
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handleMicClick} variant={isRecording ? "destructive" : "secondary"}>
              <Mic className="h-5 w-5 mr-2" />
              {isRecording ? "Detener Grabación" : "Iniciar Grabación"}
            </Button>
            <div className="space-x-2">
              <Button onClick={updateNote}>
                <Save className="h-5 w-5 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleAIAssist}>
                <Settings className="h-5 w-5 mr-2" />
                Asistente IA
              </Button>
              <Button onClick={handleDeleteNote} variant="destructive">
                <Trash className="h-5 w-5 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}