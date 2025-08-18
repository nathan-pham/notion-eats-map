-- RPC to expose Notion pages safely via security definer
CREATE OR REPLACE FUNCTION public.get_restaurant_data()
RETURNS TABLE (
  id text,
  attrs jsonb,
  created_time timestamp,
  last_edited_time timestamp
) AS $$
  SELECT id, attrs, created_time, last_edited_time
  FROM notion.pages
  WHERE archived = false;
$$ LANGUAGE sql
SECURITY DEFINER
SET search_path = public, notion;

-- Permissions
GRANT EXECUTE ON FUNCTION public.get_restaurant_data() TO anon, authenticated;