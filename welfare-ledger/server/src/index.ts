import app from './app.ts';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Welfare Ledger API running on http://localhost:${PORT}`);
});
