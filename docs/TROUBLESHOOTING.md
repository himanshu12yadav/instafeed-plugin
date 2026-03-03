# Troubleshooting

Common issues and their solutions for the Shopify Instafeed App.

## Database Issues

### "The table `main.Session` does not exist"

**Cause**: Database migrations haven't been run.

**Solution**:
```bash
npm run setup
# or
npx prisma migrate deploy
```

### "Database is locked" (SQLite)

**Cause**: Multiple processes accessing SQLite file.

**Solution**:
1. Stop all Node processes: `pkill -f node`
2. Delete lock file if exists
3. Restart app

### Prisma Client Out of Sync

**Cause**: Schema changed but client not regenerated.

**Solution**:
```bash
npx prisma generate
```

---

## Authentication Issues

### OAuth Loop / "Tried too many times"

**Cause**: App scopes changed but not synced with Shopify.

**Solution**:
```bash
npm run deploy
```

Then reinstall app on development store.

### "Invalid signature" on Webhooks

**Cause**: Wrong API secret or request tampering.

**Solution**:
1. Verify `SHOPIFY_API_SECRET` is correct
2. Ensure webhook URL is HTTPS
3. Check no middleware is modifying request body

### Session Expired Errors

**Cause**: Session storage issues or token expiry.

**Solution**:
1. Clear sessions: `npx prisma studio` → Delete Session records
2. Reinstall app
3. Check `expires` field is being set correctly

---

## Instagram Integration

### "Instagram token expired"

**Cause**: Instagram tokens expire after 60 days.

**Solution**:
1. User reconnects Instagram account
2. Token is refreshed in OAuth callback

### No Posts Fetched

**Cause**: API limits or account type mismatch.

**Solution**:
1. Verify account is Business or Creator type
2. Check Instagram API limits
3. Ensure token has required permissions

---

## Build Issues

### "Out of memory" During Build

**Cause**: Node.js running out of heap space.

**Solution**:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Docker Build Fails

**Cause**: Various dependency or network issues.

**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## Development Issues

### Tunnel Not Working

**Cause**: Cloudflare tunnel issues.

**Solution**:
1. Restart dev server: `npm run dev`
2. Try ngrok alternative (see README)
3. Check firewall settings

### HMR Not Working

**Cause**: WebSocket connection issues.

**Solution**:
1. Check `vite.config.js` HMR settings
2. Ensure ports 64999/443 are accessible
3. Disable browser extensions that block WebSocket

### "Cannot find module" Errors

**Cause**: Dependencies not installed or wrong Node version.

**Solution**:
```bash
rm -rf node_modules
npm install
```

---

## Extension Issues

### Theme Block Not Showing

**Cause**: Extension not deployed or enabled.

**Solution**:
1. Deploy extension: `npm run deploy`
2. In Shopify admin: **Online Store > Themes > Customize**
3. Add app block to a section

### App Proxy Returns 404

**Cause**: Proxy URL misconfigured.

**Solution**:
1. Check `shopify.app.toml`:
```toml
[app_proxy]
url = "https://your-app.com/proxy/handler"
subpath = "instafeed"
prefix = "apps"
```
2. Deploy: `npm run deploy`

---

## Subscription Issues

### Subscription Status Not Updating

**Cause**: Webhook not processing correctly.

**Solution**:
1. Check webhook logs in Partner Dashboard
2. Verify `webhooks.app_subscriptions.update.jsx` handler
3. Test with CLI: `shopify app webhook trigger`

### Bypass Subscription for Testing

Set in `.env`:
```env
BYPASS_SUBSCRIPTION=true
```

---

## Common Error Codes

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid/expired session | Reinstall app |
| `403 Forbidden` | Missing scopes | Deploy with updated scopes |
| `404 Not Found` | Wrong route/URL | Check route file names |
| `500 Internal Error` | Server crash | Check logs, fix bug |
| `502 Bad Gateway` | App not running | Start/restart container |

---

## Getting Help

### Debug Mode

Enable verbose logging:
```bash
DEBUG=* npm run dev
```

### View Prisma Logs

```bash
DEBUG=prisma* npm run dev
```

### Check Docker Container

```bash
# View logs
docker-compose logs -f

# Enter container
docker exec -it shopify-instafeed-app sh
```

### Shopify CLI Debug

```bash
shopify app info
shopify app config show
```
