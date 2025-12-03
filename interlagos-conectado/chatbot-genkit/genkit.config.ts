import { configureGenkit } from '@genkit-ai/core';
import { googleCloud } from '@genkit-ai/google-cloud';
import { firebase } from '@genkit-ai/firebase';

export default configureGenkit({
    plugins: [
        googleCloud(),
        firebase(),
    ],
    logLevel: 'debug',
    enablePixel: true,
});
