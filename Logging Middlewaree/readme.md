## How to Integrate:

### Import in your components:
```
import logger from './loggingMiddleware';
```
### Use Anywhere
```
logger.logAction('BUTTON_CLICK', { buttonId: 'submit' });
```
### View logs (for debugging):
```
console.log(logger.getLogs());
```
