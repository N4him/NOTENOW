"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clipboard, Mic, Search, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Página de inicio de Notenow",
  description:
    "Notenow, la aplicación que te permite tomar notas de audio y organizarlas automáticamente con IA",
};

export  function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-500">NOTENOW</div>
          <div className="hidden md:flex space-x-4">
            <a href="#servicios" className="text-gray-300 hover:text-white transition-colors">Servicios</a>
            <a href="#caracteristicas" className="text-gray-300 hover:text-white transition-colors">Características</a>
            <a href="#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a>
          </div>
          <Link href={"/pages/signup"}>
          <Button className="bg-blue-600 hover:bg-blue-700">Iniciar sesión</Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 flex-grow">
        <section className="mb-16 flex flex-col items-center md:flex-row md:justify-between">
          <div className="mb-8 text-center md:mb-0 md:text-left md:w-1/2">
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Transforma tus ideas en <span className="text-blue-500">notas organizadas</span> al instante
            </h1>
            <p className="mb-8 max-w-2xl text-gray-400 text-lg">
              Con Notenow, toma notas de audio y deja que nuestra IA las
              organice por ti. Funciona en todos tus dispositivos, para que
              nunca pierdas una idea brillante.
            </p>
            <div className="space-x-4">
              <Link href="/pages/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
                  Comienza gratis
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-6 py-3"
                onClick={toggleVideo}
              >
                Ver demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <Image
              src="/images/Clipboard1.png"
              alt="Ilustración de Notenow"
              width={400}
              height={400}
              className="rounded-lg shadow-2xl"
            />
            {isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
                <video
                  autoPlay
                  controls
                  className="w-full h-full rounded-lg"
                >
                  <source src="/videos/demo.mp4" type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>
                <button
                  onClick={toggleVideo}
                  className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="servicios" className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            Nuestros Servicios
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Mic className="h-8 w-8" />,
                title: "Transcripción Automática",
                description:
                  "Graba tus notas de voz y nuestra IA las convertirá automáticamente en texto, listo para ser organizado.",
              },
              {
                icon: <Clipboard className="h-8 w-8" />,
                title: "Resúmenes Inteligentes",
                description:
                  "¿Demasiada información? Nuestra IA crea resúmenes breves y claros de tus notas para que puedas enfocarte en lo más importante.",
              },
              {
                icon: <Tag className="h-8 w-8" />,
                title: "Etiquetado Automático",
                description:
                  "Olvídate de organizar manualmente. Notenow etiqueta automáticamente tus notas de acuerdo con los temas y palabras clave más relevantes.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="mb-4 rounded-full bg-blue-600 p-4">
                  {service.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="caracteristicas" className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            Características Destacadas
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-gray-800 p-6 flex flex-col md:flex-row items-center hover:bg-gray-700 transition-colors">
              <Image
                src="/images/Clipboard1.png"
                alt="Ilustración del servicio"
                width={150}
                height={150}
                className="rounded-lg mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Organización Inteligente
                </h3>
                <p className="text-sm text-gray-400">
                  Nuestra IA clasifica y etiqueta automáticamente tus notas según
                  su contenido, facilitando el acceso cuando las necesites.
                </p>
                <Link href="/pages/signup">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Aprende más
                </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg bg-gray-800 p-6 flex flex-col md:flex-row-reverse items-center hover:bg-gray-700 transition-colors">
              <Image
                src="/images/Clipboard1.png"
                alt="Ilustración del servicio"
                width={150}
                height={150}
                className="rounded-lg mb-4 md:mb-0 md:ml-6"
              />
              <div>
                <h3 className="mb-2 text-xl font-semibold">Búsqueda Avanzada</h3>
                <p className="text-sm text-gray-400">
                  Encuentra cualquier nota en segundos utilizando nuestra poderosa
                  búsqueda basada en IA, que comprende el contexto y el contenido.
                </p>
                <Link href="/pages/signup">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Descubre cómo
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonios" className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "María González",
                role: "Estudiante universitaria",
                quote: "Notenow ha revolucionado la forma en que tomo apuntes en clase. ¡Es increíble!",
                imageSrc: "/images/persona1.jpg"
              },
              {
                name: "Carlos Rodríguez",
                role: "Emprendedor",
                quote: "Gracias a Notenow, puedo capturar mis ideas en cualquier momento y lugar. Es una herramienta indispensable.",
                imageSrc: "/images/persona2.jpg"
              },
              {
                name: "Laura Martínez",
                role: "Escritora",
                quote: "La organización automática de Notenow me ahorra horas de trabajo. Altamente recomendado.",
                imageSrc: "/images/persona3.jpg"
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <p className="mb-4 text-gray-400 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.imageSrc}
                    alt={`Foto de ${testimonial.name}`}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            ¿Listo para revolucionar tus notas?
          </h2>
          <p className="mb-8 text-gray-400 text-lg">
            Únete a miles de usuarios que ya están aprovechando el poder de Notenow.
          </p>
          <Link href="/pages/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Comienza tu prueba gratuita
            </Button>
          </Link>
        </section>
      </main>

      <footer id="contacto" className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-2xl font-bold text-blue-500 mb-4 md:mb-0">
              NOTENOW
            </div>
            <nav className="flex flex-wrap justify-center space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Inicio</a>
              <a href="#servicios" className="text-gray-300 hover:text-white transition-colors">Servicios</a>
              <a href="#caracteristicas" className="text-gray-300 hover:text-white transition-colors">Características</a>
              <a href="#testimonios" className="text-gray-300 hover:text-white transition-colors">Testimonios</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Soporte</a>
            </nav>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Contáctanos</h3>
              <p className="text-gray-400">info@notenow.com</p>
              <p className="text-gray-400">+34 123 456 789</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013  3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} NOTENOW. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}