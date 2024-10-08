import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clipboard } from "lucide-react"
import type { Metadata } from 'next'
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Página de inicio de Notenow',
  description: 'Notenow, la aplicación que te permite tomar notas de audio y organizarlas automáticamente con IA',
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-500">NOTENOW</div>
          <div>
            {/* Agrega elementos de navegación aquí si es necesario */}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 flex-grow">
        <section className="mb-16 flex flex-col items-center md:flex-row md:justify-between">
          <div className="mb-8 text-center md:mb-0 md:text-left md:w-1/2">
            <h1 className="mb-4 text-4xl font-bold">La mejor aplicación para tomar notas de audio</h1>
            <p className="mb-8 max-w-2xl text-gray-400">
              Con Notenow, toma notas de audio y deja que nuestra IA las organice por ti. Funciona en todos tus dispositivos, para que nunca pierdas una idea.
            </p>
            <div className="space-x-4">
              <Link href={"/pages/user"}>
              <Button className="bg-blue-600 hover:bg-blue-700" >Comienza ahora</Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Aprende más
              </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/Clipboard1.png"
              alt="Ilustración de Notenow"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">Nuestros Servicios</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Transcripción Automática",
                description: "Graba tus notas de voz y nuestra IA las convertirá automáticamente en texto, listo para ser organizado.",
              },
              {
                title: "Resúmenes Inteligentes",
                description: "¿Demasiada información? Nuestra IA crea resúmenes breves y claros de tus notas para que puedas enfocarte en lo más importante.",
              },
              {
                title: "Etiquetado Automático",
                description: "Olvídate de organizar manualmente. Notenow etiqueta automáticamente tus notas de acuerdo con los temas y palabras clave más relevantes.",
              },
            ].map((service, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-blue-600 p-3">
                  <Clipboard className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>


        </section>

        <section className="mb-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-gray-800 p-6 flex flex-col md:flex-row items-center">
            <Image
              src="/images/Clipboard1.png"
              alt="Ilustración del servicio"
              width={100}
              height={100}
              className="rounded-lg mb-4 md:mb-0 md:mr-4"
            />
            <div>
              <h3 className="mb-2 text-xl font-semibold">Organización Inteligente</h3>
              <p className="text-sm text-gray-400">
                Nuestra IA clasifica y etiqueta automáticamente tus notas según su contenido, facilitando el acceso cuando las necesites.
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-800 p-6 flex flex-col md:flex-row-reverse items-center">
            <Image
              src="/images/Clipboard1.png"
              alt="Ilustración del servicio"
              width={100}
              height={100}
              className="rounded-lg mb-4 md:mb-0 md:ml-4"
            />
            <div>
              <h3 className="mb-2 text-xl font-semibold">Búsqueda Avanzada</h3>
              <p className="text-sm text-gray-400">
                Encuentra cualquier nota en segundos utilizando nuestra poderosa búsqueda basada en IA, que comprende el contexto y el contenido.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-blue-500 mb-4 md:mb-0">NOTENOW</div>
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Inicio</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre Nosotros</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Servicios</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contacto</a>
            </nav>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} NOTENOW. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
