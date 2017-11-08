package com.example.myfirstapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class InProgressRun extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_in_progress_run);
    }

    public void sendMessage(View view) {
        Intent intent = new Intent(this, RunCompleteScreen.class);
        startActivity(intent);
    }
}
