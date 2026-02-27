import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen p-4 md:p-6 lg:p-8 gap-8">
            {/* The background liquid blobs stay here */}
            <div className="liquid-bg-fixed" />

            <Sidebar />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col gap-8"
            >
                {children}
            </motion.main>
        </div>
    );
};