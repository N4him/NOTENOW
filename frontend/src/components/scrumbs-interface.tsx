"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MoreVertical, Save, Settings } from "lucide-react";
import { SpeechRecognitionService } from "../../../backend/utils/speechRecognition"; // Asegúrate de que la ruta sea correcta

const DEBOUNCE_DELAY = 700; // Tiempo en ms para el debounce

export function ScrumbsInterface() {
  const [text, setText] = useState(""); // Controla el contenido del textarea
  const [isRecording, setIsRecording] = useState(false); // Controla si el micro está grabando
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Referencia al Textarea
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null); // Referencia al servicio de reconocimiento
  const lastTranscriptRef = useRef(""); // Última transcripción para evitar duplicados
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Para almacenar el timeout

  // Ajustar la altura del Textarea dinámicamente según su contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Inicializar el servicio de reconocimiento de voz
  useEffect(() => {
    speechServiceRef.current = new SpeechRecognitionService(
      (transcript: string) => {
        // Verifica si la nueva transcripción es diferente de la última
        if (transcript !== lastTranscriptRef.current) {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current); // Limpiar el timeout anterior
          }
          // Configurar un nuevo timeout
          debounceTimeoutRef.current = setTimeout(() => {
            setText((prevText) => prevText + transcript + " "); // Actualizar el texto después del retraso
            lastTranscriptRef.current = transcript; // Actualiza la última transcripción
          }, DEBOUNCE_DELAY);
        }
      },
      () => {
        // Cuando el reconocimiento termina, desactivar la grabación
        setIsRecording(false);
      }
    );

    // Detener el reconocimiento al desmontar el componente
    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current); // Limpiar timeout en desmontar
      }
    };
  }, []);

  // Manejar el clic del botón del micrófono
  const handleMicClick = () => {
    if (isRecording) {
      // Si está grabando, detener el reconocimiento
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Si no está grabando, comenzar a grabar
      if (speechServiceRef.current) {
        speechServiceRef.current.start();
      }
      setIsRecording(true);
    }
  };

  // Manejar el cambio manual en el textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">scrumbs</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            .Teams
          </Button>
          <Input placeholder="Busca tu nota" className="bg-gray-700" />
          <div className="space-y-1">
            {[
              "Wiener Tov",
              "EstelaCruz",
              "Shea Connon",
              "Gordon Hunt",
              "Charles Hughes",
              "Noemi Esbrois",
              "Lee Simon",
            ].map((name) => (
              <Button
                key={name}
                variant="ghost"
                className="w-full justify-start"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl">Lee Simon</h2>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>LS</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 flex flex-col p-4">
          <div className="flex-1 flex items-stretch">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your text here"
              value={text} // El valor del textarea es el texto transcrito
              onChange={handleTextChange} // Maneja el cambio manual del texto
              className="w-full min-h-[40px] bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500 resize-none overflow-hidden"
              style={{ height: "auto" }}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-sm bg-white text-gray-900 hover:bg-gray-200 transition-colors ${
                isRecording ? "bg-red-500" : ""
              }`}
              onClick={handleMicClick}
            >
              <Mic className="h-5 w-5" />
              <span className="sr-only">Record audio</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-sm bg-white text-gray-900 hover:bg-gray-200 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span className="sr-only">Save note</span>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
