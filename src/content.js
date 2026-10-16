export const navItems = [
    { label: 'Journey', href: '#about', section: 'about', alias: 'journey' },
    { label: 'Arsenal', href: '#skills', section: 'skills', alias: 'arsenal' },
    { label: 'Architectures', href: '#projects', section: 'projects', alias: 'architectures' },
    { label: 'Open Source', href: '#oss', section: 'oss', alias: 'open-source' },
    { label: 'Testimonials', href: '#testimonials', section: 'testimonials' },
    { label: 'Contact', href: '#contact', section: 'contact' }
];

export const skills = [
    {
        label: 'Node.js',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg'
    },
    {
        label: 'JavaScript',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg'
    },
    {
        label: 'NoSQL (MongoDB)',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg'
    },
    {
        label: 'C++',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg'
    },
    {
        label: 'Python',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'
    },
    {
        label: 'Git',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg'
    },
    {
        label: 'Linux',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg'
    }
];

export const timelineItems = [
    { date: '2024 - Present', title: 'Computer Science Student | University' },
    { date: 'Summer 2025', title: 'Backend Engineering' },
    { date: '2023 - 2024', title: 'Adding Later' }
];

export const projects = [
    {
        id: 'term1',
        title: 'Capstone Project: Distributed Task Engine',
        subtitle: 'Boka padve',
        cta: 'View System Design',
        lines: [
            { prompt: 'rahul@cluster:~/engine$', command: 'npm run scale:workers' },
            { output: '[INFO] Linking to clustered Redis Core...' },
            { success: '[OK] Message Broker connection authenticated' },
            { output: '[INFO] Scaling BullMQ instances across 15 nodes...' },
            { success: '[OK] Worker node #102 online & listening' },
            { output: 'Processing job payload: {"id": 938217, "type": "img_process"}...' },
            { success: 'Job 938217 compressed & saved in 14ms' },
            { output: 'Processing job payload: {"id": 938218, "type": "db_sync"}...' }
        ]
    },
    {
        id: 'term2',
        title: 'Hackathon Winner: Anyone',
        cta: 'Review Source',
        lines: [
            { prompt: 'rahul@cloud-server:~$', command: 'kubectl apply -f gateway-deployment.yaml' },
            { output: 'deployment.apps/api-gateway created' },
            { prompt: 'rahul@cloud-server:~$', command: 'kubectl get pods --namespace=production' },
            { output: 'NAME                                READY   STATUS    RESTARTS   AGE' },
            { success: 'api-gateway-7b9c6f849-lx2zp         1/1     Running   0          12s' },
            { success: 'auth-service-5bbdf8b5bf-z48tr       1/1     Running   0          45m' },
            { success: 'postgres-cluster-0                  2/2     Running   0          14d' },
            { prompt: 'rahul@cloud-server:~$', command: 'curl -I https://api.prod.rahul.com/ping' },
            { success: 'HTTP/2 200 OK', output: 'x-response-time: 4ms' }
        ]
    }
];
