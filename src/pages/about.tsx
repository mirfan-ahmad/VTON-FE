import { Button } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon } from 'lucide-react';

const teamMembers = [
  {
    name: 'Irfan Ahmed',
    role: 'Team Lead',
    image: '/irfan.jpg',
    linkedin: 'https://www.linkedin.com/in/mirfan-ahmad/',
    github: 'https://github.com/mirfan-ahmad',
  },
  {
    name: 'Fahad Hussain',
    role: 'ML/AI Engineer',
    image: '/fahad.jpeg',
    linkedin: 'https://www.linkedin.com/in/fahad-hussain99/',
    github: 'https://github.com/fahadcr14',
  },
  {
    name: 'Azkar Hussain',
    role: 'ML Engineer',
    image: '/azkar.jpeg',
    linkedin: 'https://www.linkedin.com/in/azkar-hussain-84259a190/',
    github: 'https://github.com/Ax-kar',
  },
  {
    name: 'Muzammil Tariq',
    role: 'Data Engineer',
    image: '/muz.jpg',
    linkedin: 'http://www.linkedin.com/in/muhammadmuzammiltariq',
    github: 'https://github.com/Mu-iq',
  },
];

export function About() {
  return (
    <div className="flex flex-col">
      <section className="bg-gray-50 py-24">
        <div className="container">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            We're revolutionizing online shopping through advanced AI technology.
            Our mission is to make shopping more confident, enjoyable, and
            sustainable by reducing returns and enhancing the try-before-you-buy
            experience.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-lg border bg-white p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-32 w-32 rounded-full object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <div className="mt-4 flex space-x-4">
                  {member.linkedin !== '#' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(member.linkedin, '_blank')}
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {member.github !== '#' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(member.github, '_blank')}
                    >
                      <GithubIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
