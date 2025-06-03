import logoImg from '../assets/logo.svg';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  return (
    <header className="w-full px-4 py-3 flex items-center gap-3 bg-white shadow-md border-b border-gray-200 md:px-20">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <img src={logoImg} alt="Logo" className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">ContAi</h1>
      <Avatar className="ml-auto">
        <AvatarImage src="https://github.com/luanrobert07.png" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
    </header>
  );
}
