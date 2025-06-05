import logoImg from '../assets/logo.svg';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type HeaderProps = {
  userName: string;
  userAvatarUrl?: string;
}

export function Header({ userName, userAvatarUrl }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3 flex items-center gap-3 bg-white shadow-md border-b border-gray-200 md:px-20">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <img src={logoImg} alt="Logo" className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">ContAi</h1>
      <Avatar className="ml-auto">
        {userAvatarUrl ? (
          <AvatarImage src={userAvatarUrl} />
        ) : (
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
    </header>
  );
}

