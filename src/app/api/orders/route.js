import supabase from "../../../../lib/supabase";

export async function GET() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, drink:drink_id(name, price), topping:topping_id(name, price)");
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(orders), { status: 200 });
}

export async function POST(request) {
  const { drink_id, topping_id, quantity, total_price } = await request.json();
  const { data, error } = await supabase
    .from("orders")
    .insert([{ drink_id, topping_id, quantity, total_price }]);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(data), { status: 201 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { data, error } = await supabase.from("orders").delete().eq("id", id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}
